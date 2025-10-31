# WhatsApp Business Dashboard

A comprehensive WhatsApp Business management platform with MongoDB integration, multi-phone number support, real-time messaging, and analytics.

## Features

- **Multi-Phone Number Management**: Manage multiple WhatsApp Business phone numbers (Support, Sales, Main, etc.)
- **Real-time Message Inbox**: View and respond to customer messages with auto-polling for real-time updates
- **Send Messages**: Send text and template messages to customers
- **Analytics Dashboard**: View messaging statistics, response times, and conversation metrics
- **MongoDB Integration**: All messages and conversations stored in MongoDB Atlas with full history

## Setup

### 1. MongoDB Atlas

Add your MongoDB connection string to environment variables:

\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
\`\`\`

### 2. WhatsApp Business API

For each phone number you add, you'll need:
- WhatsApp Phone Number ID (from Meta Business Manager)
- WhatsApp Access Token (from Meta Business Manager)

### 3. Environment Variables

Required environment variables:
- `MONGODB_URI` - MongoDB Atlas connection string
- `ERP_API_KEY` - API key for ERP integration endpoints

### 4. Getting Started

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Open http://localhost:3000
4. Add your first WhatsApp Business phone number
5. Start managing conversations!

## Pages

- `/business` - Main dashboard with phone number management
- `/business/inbox?phone={id}` - Real-time message inbox
- `/business/send?phone={id}` - Send messages interface
- `/business/analytics?phone={id}` - Analytics and statistics

## API Endpoints

### Phone Numbers
- `GET /api/phone-numbers` - List all phone numbers
- `POST /api/phone-numbers` - Add new phone number
- `GET /api/phone-numbers/[id]` - Get phone number details
- `PATCH /api/phone-numbers/[id]` - Update phone number
- `DELETE /api/phone-numbers/[id]` - Delete phone number

### Messages
- `GET /api/messages` - Get messages for a conversation
- `POST /api/messages` - Save message to database
- `POST /api/messages/send` - Send WhatsApp message

### Conversations
- `GET /api/conversations` - Get conversations for a phone number

### Analytics
- `GET /api/analytics?type=dashboard` - Get dashboard statistics
- `GET /api/analytics?type=detailed` - Get detailed analytics

## Database Schema

### Collections

1. **phone_numbers** - WhatsApp Business phone numbers
2. **messages** - All sent and received messages
3. **conversations** - Customer conversation threads
4. **analytics** - Daily aggregated statistics

## Tech Stack

- Next.js 15
- MongoDB with native driver
- TypeScript
- Tailwind CSS
- shadcn/ui components
- WhatsApp Cloud API

## Notes

- Messages are polled every 3-5 seconds for real-time updates
- All messages are automatically saved to MongoDB
- Analytics are updated in real-time as messages are sent/received
- Template messages require pre-approved templates from Meta
