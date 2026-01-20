import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, templateVars } = body;

    if (!to || !subject || !templateVars) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, or templateVars' },
        { status: 400 }
      );
    }

    // Generate HTML email with Exodus branding
    const htmlContent = generateLoginCredentialsEmail(templateVars);

    // Send email to customer
    const customerEmail = await resend.emails.send({
      from: 'Exodus <support@exodusprop.com>',
      to: [to],
      subject: subject,
      html: htmlContent,
    });

    // Send admin notification email (same pattern as SC-SYSTEM)
    const adminHtmlContent = generateAdminNotificationEmail(to, templateVars);
    const adminEmail = await resend.emails.send({
      from: 'support@exodusprop.com',
      to: 'support@exodusprop.com',
      subject: `Login Credentials Sent - ${templateVars['{CUSTOMER_NAME}']}`,
      html: adminHtmlContent,
    });

    return NextResponse.json({ success: true, data: customerEmail, adminNotification: adminEmail });
  } catch (error: any) {
    console.error('Error sending template email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

function generateLoginCredentialsEmail(vars: Record<string, string>): string {
  const customerName = vars['{CUSTOMER_NAME}'] || 'Valued Customer';
  const login = vars['{LOGIN}'] || '';
  const password = vars['{PASSWORD}'] || '';
  const server = vars['{SERVER}'] || '';
  const platform = vars['{PLATFORM}'] || 'MT5';
  const accountSize = vars['{ACCOUNT_SIZE}'] || '';
  const challengeType = vars['{CHALLENGE_TYPE}'] || '1-Step Challenge';
  
  // Determine rules based on challenge type
  const isElite = challengeType.toLowerCase().includes('elite');
  const isFunded = challengeType.toLowerCase().includes('funded');
  
  // Challenge rules based on type
  // 1-Step: 8% profit, 6% static max DD, 4% daily
  // 1-Step Funded: 8% max DD, 4% daily
  // Elite: 10% profit, NO max DD, 10% trailing daily
  // Elite Funded: NO max DD, 10% trailing daily
  const profitTarget = isFunded ? 'N/A (Payout eligible)' : (isElite ? '10%' : '8%');
  const maxDrawdown = isElite ? 'None' : (isFunded ? '8%' : '6%');
  const maxDrawdownType = isElite ? '' : ' (static)';
  const dailyLoss = isElite ? '10%' : (isFunded ? '4%' : '4%');
  const dailyLossType = isElite ? ' (trailing EOD)' : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>Your Trading Challenge Credentials</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .force-light { color-scheme: light !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7; color-scheme: light only;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;" class="force-light">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #60A5FA 100%); padding: 50px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: -0.5px;">Exodus</h1>
              <p style="color: rgba(255,255,255,0.95); margin: 12px 0 0 0; font-size: 18px;">Your Trading Challenge Credentials</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <!-- Greeting -->
              <p style="color: #1a1a1a; font-size: 18px; line-height: 1.6; margin: 0 0 25px 0;">
                Hello <strong style="color: #1e40af;">${customerName}</strong>,
              </p>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.7; margin: 0 0 35px 0;">
                Congratulations! Your <strong>${challengeType}</strong> account has been set up and is ready for trading. Below are your login credentials to access your trading platform.
              </p>
              
              <!-- Credentials Box - Dark Mode Compatible -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; border: 3px solid #1e40af; margin-bottom: 35px;">
                <tr>
                  <td style="padding: 30px; background-color: #ffffff;">
                    <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #ffffff;">
                      <tr style="background-color: #ffffff;">
                        <td style="color: #475569; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background-color: #ffffff;">Platform</td>
                        <td style="color: #1e40af; font-size: 16px; font-weight: bold; text-align: right; background-color: #ffffff;">${platform}</td>
                      </tr>
                      <tr style="border-top: 2px solid #e2e8f0; background-color: #ffffff;">
                        <td style="color: #475569; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-top: 12px; background-color: #ffffff;">Login ID</td>
                        <td style="color: #000000; font-size: 18px; font-weight: bold; text-align: right; font-family: 'Courier New', monospace; padding-top: 12px; background-color: #ffffff; border: 2px solid #1e40af; padding: 12px; border-radius: 6px;">${login}</td>
                      </tr>
                      <tr style="border-top: 2px solid #e2e8f0; background-color: #ffffff;">
                        <td style="color: #475569; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background-color: #ffffff;">Password</td>
                        <td style="color: #000000; font-size: 18px; font-weight: bold; text-align: right; font-family: 'Courier New', monospace; background-color: #ffffff; border: 2px solid #1e40af; padding: 12px; border-radius: 6px;">${password}</td>
                      </tr>
                      <tr style="border-top: 2px solid #e2e8f0; background-color: #ffffff;">
                        <td style="color: #475569; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background-color: #ffffff;">Server</td>
                        <td style="color: #000000; font-size: 16px; font-weight: 700; text-align: right; background-color: #ffffff;">${server}</td>
                      </tr>
                      <tr style="border-top: 3px solid #1e40af; background-color: #f0f9ff;">
                        <td style="color: #1e40af; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-top: 16px; background-color: #f0f9ff;">Account Size</td>
                        <td style="color: #1e40af; font-size: 26px; font-weight: bold; text-align: right; padding-top: 16px; background-color: #f0f9ff;">${accountSize}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Next Steps -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 35px;">
                <p style="color: #92400e; font-size: 14px; font-weight: 600; margin: 0 0 10px 0;">⚠️ IMPORTANT - Keep This Information Secure</p>
                <p style="color: #78350f; font-size: 13px; line-height: 1.6; margin: 0;">
                  These are your personal login credentials. Do not share them with anyone. Exodus will never ask for your password.
                </p>
              </div>
              
              <p style="color: #1a1a1a; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">
                📋 Next Steps:
              </p>
              <ol style="color: #4a5568; font-size: 15px; line-height: 1.8; margin: 0 0 35px 0; padding-left: 25px;">
                <li style="margin-bottom: 8px;">Download and install <strong>${platform}</strong> from the official website if you haven't already</li>
                <li style="margin-bottom: 8px;">Open ${platform} and click "File" → "Login to Trade Account"</li>
                <li style="margin-bottom: 8px;">Enter your <strong>Login ID</strong> and <strong>Password</strong></li>
                <li style="margin-bottom: 8px;">Select <strong>${server}</strong> from the server list</li>
                <li style="margin-bottom: 8px;">Review the challenge rules in your dashboard at <a href="https://exodusprop.com/dashboard" style="color: #1e40af; text-decoration: none;">exodusprop.com/dashboard</a></li>
                <li>Start trading and reach your profit target! 🚀</li>
              </ol>
              
              <!-- Challenge Rules Reminder -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 8px; margin-bottom: 35px;">
                <tr>
                  <td style="padding: 25px;">
                    <p style="color: #1e40af; font-size: 15px; font-weight: 700; margin: 0 0 12px 0;">📊 ${challengeType} Rules:</p>
                    <ul style="color: #475569; font-size: 14px; line-height: 1.7; margin: 0; padding-left: 20px;">
                      <li>Profit Target: <strong>${profitTarget}</strong></li>
                      <li>Maximum Drawdown: <strong>${maxDrawdown}</strong>${maxDrawdownType}</li>
                      <li>Daily Loss Limit: <strong>${dailyLoss}</strong>${dailyLossType}</li>
                      <li>Minimum Trading Days: <strong>None</strong></li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <!-- Support Section -->
              <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 0;">
                Need help getting started? Our support team is here for you:<br>
                📧 <a href="mailto:support@exodusprop.com" style="color: #1e40af; text-decoration: none; font-weight: 600;">support@exodusprop.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 35px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 13px; margin: 0 0 8px 0;">
                © 2024 Exodus. All rights reserved.
              </p>
              <p style="color: #cbd5e1; font-size: 12px; margin: 0;">
                This email contains sensitive information. Please keep it secure and do not forward it.
              </p>
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

function generateAdminNotificationEmail(customerEmail: string, vars: Record<string, string>): string {
  const customerName = vars['{CUSTOMER_NAME}'] || 'Customer';
  const login = vars['{LOGIN}'] || '';
  const password = vars['{PASSWORD}'] || '';
  const server = vars['{SERVER}'] || '';
  const platform = vars['{PLATFORM}'] || 'MT5';
  const accountSize = vars['{ACCOUNT_SIZE}'] || '';
  const challengeType = vars['{CHALLENGE_TYPE}'] || '1-Step Challenge';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <tr>
            <td style="background-color: #dc2626; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🔔 Admin Notification</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">MT5 Credentials Sent</p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <p style="color: #000000; font-size: 16px; margin: 0 0 20px 0;">
                <strong>MT5 login credentials have been sent to:</strong>
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 2px solid #60A5FA; border-radius: 8px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #000000; font-size: 18px; font-weight: bold; margin: 0 0 5px 0;">${customerName}</p>
                    <p style="color: #475569; font-size: 14px; margin: 0;">${customerEmail}</p>
                  </td>
                </tr>
              </table>
              
              <p style="color: #000000; font-size: 15px; font-weight: 600; margin: 0 0 15px 0;">Credentials Sent:</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #64748b; font-size: 13px; font-weight: 600;">Platform:</td>
                        <td style="color: #000000; font-size: 14px; font-weight: 600; text-align: right;">${platform}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 13px; font-weight: 600;">Login:</td>
                        <td style="color: #000000; font-size: 14px; font-family: monospace; text-align: right; font-weight: 600;">${login}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 13px; font-weight: 600;">Password:</td>
                        <td style="color: #000000; font-size: 14px; font-family: monospace; text-align: right; font-weight: 600;">${password}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 13px; font-weight: 600;">Server:</td>
                        <td style="color: #000000; font-size: 14px; text-align: right; font-weight: 600;">${server}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 13px; font-weight: 600;">Account Size:</td>
                        <td style="color: #1e40af; font-size: 16px; font-weight: bold; text-align: right;">${accountSize}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 13px; font-weight: 600;">Challenge Type:</td>
                        <td style="color: #000000; font-size: 14px; text-align: right; font-weight: 600;">${challengeType}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                Admin Notification - Exodus
              </p>
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


