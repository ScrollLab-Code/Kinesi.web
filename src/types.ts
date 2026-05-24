// Shared types and interfaces for the Kinase application

export interface Course {
  id: string
  title: string
  description: string
  price: number
  duration: string
  modules: number
  image?: string
}

export interface Testimonial {
  id: string
  author: string
  role: string
  content: string
  rating: number
  image?: string
}

export interface PaymentSchedule {
  id: string
  name: string
  description: string
  installments: Installment[]
  totalPrice: number
}

export interface Installment {
  number: number
  amount: number
  dueDate: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
