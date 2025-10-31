# WhatsApp ERP API Integration Guide

## Security Note
**Important:** Never expose your API key in client-side code. Always use server-side API routes or server actions.

## Setup for Your Next.js Application

### Step 1: Add Environment Variables

In your Next.js project, create a `.env.local` file:

\`\`\`env
# Server-side only - never use NEXT_PUBLIC_ prefix for API keys
ERP_API_URL=https://v0-yfcsolution-my-whatsapp-app.vercel.app
ERP_API_KEY=my-erp-secret-key-2025
\`\`\`

### Step 2: Copy Integration Files

Copy these files to your Next.js project:
- `lib/erp-integration.ts` - Client-side helper functions
- `app/api/send-whatsapp-message/route.ts` - Server-side API route
- `examples/server-action-example.ts` - Server action example

### Step 3: Usage Examples

#### Option 1: Using Client Component (Recommended)

\`\`\`tsx
"use client"

import { sendTextMessage } from "@/lib/erp-integration"

export default function MyComponent() {
  const handleSend = async () => {
    const result = await sendTextMessage(
      "+923130541339",
      "Your order has been confirmed!",
      "high"
    )
    
    if (result.success) {
      console.log("Message sent:", result.messageId)
    } else {
      console.error("Error:", result.error)
    }
  }

  return <button onClick={handleSend}>Send Message</button>
}
\`\`\`

#### Option 2: Using Server Action

\`\`\`tsx
"use server"

import { sendWhatsAppMessage } from "@/examples/server-action-example"

export async function handleOrderConfirmation(orderId: string, phone: string) {
  const result = await sendWhatsAppMessage(
    phone,
    `Your order #${orderId} has been confirmed!`
  )
  
  return result
}
\`\`\`

#### Option 3: Direct API Call from Server Component

\`\`\`tsx
// Server Component
export default async function OrderPage() {
  const sendNotification = async (phone: string, message: string) => {
    "use server"
    
    const response = await fetch(`${process.env.ERP_API_URL}/api/erp/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ERP_API_KEY!,
      },
      body: JSON.stringify({ to: phone, message, priority: "high" }),
    })
    
    return response.json()
  }
  
  // Use sendNotification in your server component
}
\`\`\`

## API Reference

### Send Text Message

\`\`\`typescript
await sendTextMessage(
  "+923130541339",           // Phone number with country code
  "Your message here",       // Message text
  "high"                     // Priority: "low" | "medium" | "high"
)
\`\`\`

### Send Template Message

\`\`\`typescript
await sendTemplateMessage(
  "+923130541339",           // Phone number
  "hello_world",             // Template name
  "en_US",                   // Language code
  "high"                     // Priority
)
\`\`\`

## Common Use Cases

### Order Confirmation
\`\`\`typescript
await sendTextMessage(
  customerPhone,
  `Order #${orderId} confirmed! Total: $${total}. Delivery in 3-5 days.`,
  "high"
)
\`\`\`

### Payment Reminder
\`\`\`typescript
await sendTextMessage(
  customerPhone,
  `Payment reminder: Invoice #${invoiceId} of $${amount} is due tomorrow.`,
  "medium"
)
\`\`\`

### Shipping Update
\`\`\`typescript
await sendTextMessage(
  customerPhone,
  `Your package has been shipped! Tracking: ${trackingNumber}`,
  "high"
)
\`\`\`

## Troubleshooting

### Error: "Invalid API key"
- Check that `ERP_API_KEY` is set in your environment variables
- Verify the key matches what's configured in Vercel
- Make sure you're not using `NEXT_PUBLIC_` prefix (security risk)

### Error: "Phone number validation failed"
- Phone numbers must include country code (e.g., "+923130541339")
- Use E.164 format: + followed by country code and number
- No spaces or special characters except +

### Messages not being received
- Verify WhatsApp credentials are set in Vercel:
  - `WHATSAPP_ACCESS_TOKEN`
  - `WHATSAPP_PHONE_NUMBER_ID`
- Check that the phone number is registered with WhatsApp
- For template messages, ensure the template is approved in Meta Business Suite
