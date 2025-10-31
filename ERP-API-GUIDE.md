# ERP WhatsApp Integration API Guide

## Overview
This API allows you to send WhatsApp messages from your ERP system using the official WhatsApp Cloud API.

## Base URL
\`\`\`
https://v0-yfcsolution-my-whatsapp-app.vercel.app/api/erp
\`\`\`

## Authentication
All requests require an API key in the header:
\`\`\`
x-api-key: your-api-key-here
\`\`\`

## Endpoints

### 1. Send Text Message
Send a simple text message to a WhatsApp number.

**Endpoint:** `POST /api/erp/send-message`

**Request:**
\`\`\`json
{
  "to": "+923130541339",
  "message": "Your order #12345 has been shipped!",
  "priority": "high"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "messageId": "wamid.HBgNOTIzMTMwNTQxMzM5FQIAERgSQzE3...",
  "timestamp": "2025-10-30T07:30:00.000Z",
  "to": "+923130541339",
  "status": "sent"
}
\`\`\`

### 2. Send Template Message
Send a pre-approved WhatsApp template message.

**Endpoint:** `POST /api/erp/send-message`

**Request:**
\`\`\`json
{
  "to": "+923130541339",
  "message": "Template message",
  "messageType": "template",
  "templateName": "hello_world",
  "templateLanguage": "en_US"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "messageId": "wamid.HBgNOTIzMTMwNTQxMzM5FQIAERgSQzE3...",
  "timestamp": "2025-10-30T07:30:00.000Z",
  "to": "+923130541339",
  "status": "sent"
}
\`\`\`

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `to` | string | Yes | Phone number in E.164 format (+923130541339) |
| `message` | string | Yes | Message text (max 4096 characters) |
| `messageType` | string | No | "text" (default) or "template" |
| `templateName` | string | No | Template name (required if messageType is "template") |
| `templateLanguage` | string | No | Language code (default: "en_US") |
| `priority` | string | No | "low", "medium", or "high" (default: "medium") |
| `metadata` | object | No | Additional data for tracking |

## Common Use Cases

### Order Confirmation
\`\`\`json
{
  "to": "+923130541339",
  "message": "Order #12345 confirmed! Total: $99.99. Estimated delivery: 3-5 days.",
  "priority": "high",
  "metadata": {
    "orderId": "12345",
    "orderTotal": 99.99
  }
}
\`\`\`

### Payment Reminder
\`\`\`json
{
  "to": "+923130541339",
  "message": "Payment reminder: Invoice #INV-001 of $500 is due tomorrow.",
  "priority": "medium"
}
\`\`\`

### Shipping Update
\`\`\`json
{
  "to": "+923130541339",
  "message": "Your package has been shipped! Tracking: TRK123456789",
  "priority": "high"
}
\`\`\`

### Using Templates (for marketing/notifications)
\`\`\`json
{
  "to": "+923130541339",
  "message": "Hello World Template",
  "messageType": "template",
  "templateName": "hello_world",
  "templateLanguage": "en_US"
}
\`\`\`

## Error Responses

### Invalid API Key
\`\`\`json
{
  "success": false,
  "error": "Invalid or missing API key",
  "status": "failed"
}
\`\`\`

### Invalid Phone Number
\`\`\`json
{
  "success": false,
  "error": "Invalid phone number format",
  "status": "failed"
}
\`\`\`

### WhatsApp API Error
\`\`\`json
{
  "success": false,
  "error": "Failed to send WhatsApp message",
  "status": "failed"
}
\`\`\`

## Integration Examples

### PHP
\`\`\`php
<?php
$apiUrl = 'https://v0-yfcsolution-my-whatsapp-app.vercel.app/api/erp/send-message';
$apiKey = 'my-erp-secret-key-2025';

$data = [
    'to' => '+923130541339',
    'message' => 'Your order has been shipped!',
    'priority' => 'high'
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'x-api-key: ' . $apiKey
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>
\`\`\`

### Python
\`\`\`python
import requests

url = 'https://v0-yfcsolution-my-whatsapp-app.vercel.app/api/erp/send-message'
headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'my-erp-secret-key-2025'
}
data = {
    'to': '+923130541339',
    'message': 'Your order has been shipped!',
    'priority': 'high'
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
\`\`\`

### cURL
\`\`\`bash
curl -X POST https://v0-yfcsolution-my-whatsapp-app.vercel.app/api/erp/send-message \
  -H "Content-Type: application/json" \
  -H "x-api-key: my-erp-secret-key-2025" \
  -d '{
    "to": "+923130541339",
    "message": "Your order has been shipped!",
    "priority": "high"
  }'
\`\`\`

## Setup Requirements

### Environment Variables (Vercel)
You need to configure these in your Vercel project:

1. **ERP_API_KEY** - Your custom API key for authentication
2. **WHATSAPP_ACCESS_TOKEN** - Your WhatsApp Business API access token
3. **WHATSAPP_PHONE_NUMBER_ID** - Your WhatsApp Business phone number ID

### Getting WhatsApp Credentials
1. Go to https://developers.facebook.com/
2. Create or select your WhatsApp Business app
3. Navigate to WhatsApp → Getting Started
4. Copy your Phone Number ID and Access Token
5. Add them to Vercel environment variables

## Testing
Use the testing interface at:
\`\`\`
https://v0-yfcsolution-my-whatsapp-app.vercel.app/erp-test
\`\`\`

## Support
For issues or questions, check the Vercel logs or contact support.
