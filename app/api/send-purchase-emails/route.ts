import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerEmail, 
      customerName, 
      accountSize, 
      platform, 
      price,
      paymentMethod = 'card'
    } = body;

    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send customer confirmation email
    const customerHtml = generateCustomerConfirmationEmail(customerName, accountSize, platform, price);
    await resend.emails.send({
      from: 'Exodus <support@exodusprop.com>',
      to: [customerEmail],
      subject: 'Your Exodus Challenge Purchase Confirmed! 🎉',
      html: customerHtml,
    });

    // Send admin notification email (same pattern as SC-SYSTEM)
    const adminHtml = generateAdminPurchaseNotification(customerEmail, customerName, accountSize, platform, price, paymentMethod);
    await resend.emails.send({
      from: 'support@exodusprop.com',
      to: 'support@exodusprop.com',
      subject: `New Purchase: ${accountSize} - ${customerName}`,
      html: adminHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending purchase emails:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send emails' },
      { status: 500 }
    );
  }
}

function generateCustomerConfirmationEmail(customerName: string, accountSize: string, platform: string, price: number): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f7; color-scheme: light only;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #60A5FA 100%); padding: 50px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">Exodus</h1>
              <p style="color: #ffffff; margin: 12px 0 0 0; font-size: 18px;">Purchase Confirmed! 🎉</p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 50px 40px; background-color: #ffffff;">
              <p style="color: #000000; font-size: 18px; margin: 0 0 25px 0;">
                Hello <strong style="color: #1e40af;">${customerName}</strong>,
              </p>
              
              <p style="color: #1a1a1a; font-size: 16px; line-height: 1.7; margin: 0 0 30px 0;">
                Thank you for your purchase! Your payment has been successfully processed and your challenge account is being set up.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; border: 2px solid #60A5FA; border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px; background-color: #f0f9ff;">
                    <table width="100%" cellpadding="10" cellspacing="0">
                      <tr>
                        <td style="color: #475569; font-size: 14px; font-weight: 600; background-color: #f0f9ff;">Account Size:</td>
                        <td style="color: #1e40af; font-size: 20px; font-weight: bold; text-align: right; background-color: #f0f9ff;">${accountSize}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 14px; font-weight: 600; background-color: #f0f9ff;">Platform:</td>
                        <td style="color: #000000; font-size: 16px; font-weight: 600; text-align: right; background-color: #f0f9ff;">${platform}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 14px; font-weight: 600; background-color: #f0f9ff;">Amount Paid:</td>
                        <td style="color: #16a34a; font-size: 18px; font-weight: bold; text-align: right; background-color: #f0f9ff;">$${price}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <p style="color: #92400e; font-size: 14px; font-weight: 600; margin: 0 0 10px 0;">📋 What Happens Next?</p>
                <p style="color: #78350f; font-size: 13px; line-height: 1.6; margin: 0;">
                  Our team is setting up your trading account. You'll receive your MT5 login credentials via email within 24 hours. Check your dashboard to track your account status.
                </p>
              </div>
              
              <p style="color: #000000; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">Next Steps:</p>
              <ol style="color: #1a1a1a; font-size: 15px; line-height: 1.8; margin: 0 0 30px 0; padding-left: 25px;">
                <li>Wait for your MT5 credentials email (within 24 hours)</li>
                <li>Check your <a href="https://exodusprop.com/dashboard" style="color: #1e40af; text-decoration: none; font-weight: 600;">dashboard</a> for updates</li>
                <li>Download ${platform} from the official website</li>
                <li>Review the challenge rules</li>
              </ol>
              
              <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 0;">
                Questions? Contact us at <a href="mailto:support@exodusprop.com" style="color: #1e40af; text-decoration: none; font-weight: 600;">support@exodusprop.com</a>
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; margin: 0;">© 2024 Exodus. All rights reserved.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function generateAdminPurchaseNotification(customerEmail: string, customerName: string, accountSize: string, platform: string, price: number, paymentMethod: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 30px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
          
          <tr>
            <td style="background-color: #dc2626; padding: 25px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🔔 New Purchase Alert</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <p style="color: #000000; font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">New challenge purchase received!</p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 2px solid #60A5FA; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px; background-color: #f8fafc;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f8fafc;">Customer:</td>
                        <td style="color: #000000; font-size: 14px; font-weight: 600; text-align: right; background-color: #f8fafc;">${customerName}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f8fafc;">Email:</td>
                        <td style="color: #000000; font-size: 14px; text-align: right; background-color: #f8fafc;">${customerEmail}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f8fafc;">Account Size:</td>
                        <td style="color: #1e40af; font-size: 18px; font-weight: bold; text-align: right; background-color: #f8fafc;">${accountSize}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f8fafc;">Platform:</td>
                        <td style="color: #000000; font-size: 14px; font-weight: 600; text-align: right; background-color: #f8fafc;">${platform}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f8fafc;">Payment Method:</td>
                        <td style="color: #000000; font-size: 14px; font-weight: 600; text-align: right; text-transform: uppercase; background-color: #f8fafc;">${paymentMethod}</td>
                      </tr>
                      <tr style="border-top: 2px solid #60A5FA;">
                        <td style="color: #475569; font-size: 13px; font-weight: 600; padding-top: 12px; background-color: #f8fafc;">Amount:</td>
                        <td style="color: #16a34a; font-size: 20px; font-weight: bold; text-align: right; padding-top: 12px; background-color: #f8fafc;">$${price}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #1e40af;">
                <p style="color: #1e3a8a; font-size: 13px; margin: 0; font-weight: 600;">
                  ⚡ Action Required: Set up MT5 account and send credentials to customer
                </p>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 11px; margin: 0;">Admin Notification - Exodus</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

