/// <reference types="node" />
import { handleSendEmail } from '../src/lib/send-email'

export const config = {
  runtime: 'edge',
}

export default {
  async fetch(req: Request) {
    return handleSendEmail(req, {
      resendApiKey: process.env.RESEND_API_KEY,
      resendFrom: process.env.RESEND_FROM_EMAIL,
      resendTo: process.env.SEND_TO_EMAIL,
    })
  },
}
