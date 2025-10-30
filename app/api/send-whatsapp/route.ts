import { NextResponse } from 'next/server';

// This handles sending messages via WhatsApp API
export async function POST(request: Request) {
  try {
    const { to, message } = await request.json();
    
    // Validate input
    if (!to || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing phone number or message' },
        { status: 400 }
      );
    }

    console.log('📱 WhatsApp API Request:', { to, message });

    // SIMULATION MODE - Remove this when you have real WhatsApp credentials
    // For now, we'll simulate successful message sending
    const simulationResult = {
      success: true,
      messageId: `wa-sim-${Date.now()}`,
      timestamp: new Date().toISOString(),
      to: to,
      message: message,
      note: "This is simulation mode. Add WhatsApp credentials to send real messages."
    };

    // TODO: Uncomment and use this when you have real WhatsApp credentials
    /*
    // REAL WHATSAPP API INTEGRATION
    const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    
    const realResponse = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      })
    });
    
    const realResult = await realResponse.json();
    */

    return NextResponse.json(simulationResult);
    
  } catch (error) {
    console.error('❌ WhatsApp API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send WhatsApp message',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for testing
export async function GET() {
  return NextResponse.json({
    status: 'WhatsApp API is working!',
    timestamp: new Date().toISOString(),
    instructions: 'Send POST request with { to: "phone", message: "text" }'
  });
}
