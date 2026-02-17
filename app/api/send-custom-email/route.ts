import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, or html' },
        { status: 400 }
      );
    }

    const supportEmail = 'support@exodusprop.com';

    const { data, error } = await resend.emails.send({
      from: supportEmail,
      to: to,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Error sending custom email:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in send-custom-email route:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
