/**
 * HOOK DE SEGURIDAD PARA FRONTEND
 * Rate limiting, validación, sanitización
 */

import { useCallback, useRef } from 'react';
import { RATE_LIMITS, sanitizeInput, sanitizeObject, VALIDATION_RULES, INPUT_LIMITS } from '../../security-config';

/**
 * Hook para manejar rate limiting en el cliente
 */
export function useRateLimit(limitType: keyof typeof RATE_LIMITS = 'API') {
  const attemptsRef = useRef<number[]>([]);

  const isAllowed = useCallback(() => {
    const now = Date.now();
    const limit = RATE_LIMITS[limitType];
    const windowMs = limit.window * 1000;

    // Filtrar intentos fuera de la ventana de tiempo
    attemptsRef.current = attemptsRef.current.filter((t) => now - t < windowMs);

    // Verificar si se excedió el límite
    if (attemptsRef.current.length >= limit.requests) {
      return false;
    }

    attemptsRef.current.push(now);
    return true;
  }, [limitType]);

  const reset = useCallback(() => {
    attemptsRef.current = [];
  }, []);

  return { isAllowed, reset };
}

/**
 * Hook para validar formularios
 */
export function useFormValidation<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useStateRef(initialValues);
  const [errors, setErrors] = useStateRef<Record<string, string>>({});

  const validateField = useCallback((field: string, value: string) => {
    const newErrors = { ...errors };

    // Validaciones básicas
    if (!value.trim()) {
      newErrors[field] = 'Este campo es obligatorio';
      setErrors(newErrors);
      return false;
    }

    // Validaciones específicas
    if (field === 'email' && !VALIDATION_RULES.email.test(value)) {
      newErrors[field] = 'Email inválido';
    } else if (field === 'phone' && !VALIDATION_RULES.phone.test(value)) {
      newErrors[field] = 'Teléfono inválido';
    } else if (field === 'nombre' && !VALIDATION_RULES.name.test(value)) {
      newErrors[field] = 'Solo letras y espacios permitidos';
    }

    // Validar límite de caracteres
    const limit = INPUT_LIMITS[field as keyof typeof INPUT_LIMITS];
    if (limit && value.length > limit) {
      newErrors[field] = `Máximo ${limit} caracteres`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [errors]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitized = sanitizeInput(value);

    setValues({ ...values, [name]: sanitized });
    validateField(name, sanitized);
  }, [values, validateField]);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    for (const [field, value] of Object.entries(values)) {
      if (!value || (typeof value === 'string' && !value.trim())) {
        newErrors[field] = 'Campo requerido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  return { values, errors, handleChange, validate, setValues, validateField };
}

/**
 * Hook para sanitizar datos
 */
export function useSanitize() {
  return {
    sanitizeInput,
    sanitizeObject,
  };
}

/**
 * Hook para peticiones seguras a API
 */
export function useSecureAPI() {
  const { isAllowed } = useRateLimit('API');
  const [loading, setLoading] = useStateRef(false);
  const [error, setError] = useStateRef<string | null>(null);

  const fetchSecure = useCallback(
    async (url: string, options: RequestInit = {}) => {
      // Rate limiting
      if (!isAllowed()) {
        setError('Demasiadas peticiones. Espera un momento.');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        console.error('[API Error]', message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isAllowed]
  );

  return { fetchSecure, loading, error };
}

/**
 * Hook auxiliar para estado con ref
 */
function useStateRef<T>(initial: T) {
  const [state, setState] = React.useState(initial);
  const ref = React.useRef(state);

  React.useEffect(() => {
    ref.current = state;
  }, [state]);

  return [state, setState] as const;
}

/**
 * Hook para detectar tentativas de XSS
 */
export function useXSSDetection() {
  return useCallback((input: string): boolean => {
    const xssPatterns = [
      /<script/gi,
      /javascript:/gi,
      /on\w+\s*=/gi, // onclick=, onload=, etc
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
    ];

    return xssPatterns.some((pattern) => pattern.test(input));
  }, []);
}

// Re-exportar React si es necesario
import * as React from 'react';
