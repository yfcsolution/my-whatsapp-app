import { NextResponse } from 'next/server';

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

    // SIMULATION MODE - Working simulation
    const simulationResult = {
      success: true,
      messageId: `wa-sim-${Date.now()}`,
      timestamp: new Date().toISOString(),
      to: to,
      message: message,
      note: "This is simulation mode. Add WhatsApp credentials to send real messages."
    };

    return NextResponse.json(simulationResult);
    
  } catch (error: any) {
    console.error('❌ WhatsApp API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send WhatsApp message'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'WhatsApp API is working!',
    timestamp: new Date().toISOString(),
    instructions: 'Send POST request with { to: "phone", message: "text" }'
  });
}
