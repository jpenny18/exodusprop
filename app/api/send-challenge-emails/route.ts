import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, email, name, challengeType, accountSize, step, breachType, maxDrawdown, dailyDrawdown, currentDrawdown, warningType, adminEmail, accountType, customHtml } = body;

    if (!type || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: type, email, or name' },
        { status: 400 }
      );
    }

    let htmlContent = '';
    let subject = '';

    // Use custom HTML if provided, otherwise generate based on type
    if (customHtml) {
      htmlContent = customHtml;
      
      // Set subject based on type
      switch (type) {
        case 'pass':
          subject = `🎉 Congratulations! You've Passed Your ${step || 'Challenge'}!`;
          break;
        case 'fail':
          subject = `Challenge Update - ${challengeType}`;
          break;
        case 'drawdown-warning':
          subject = `⚠️ Drawdown Warning - Action Required`;
          break;
        case 'funded-pass':
          subject = `🎊 Congratulations! Your Funded Account Is Ready!`;
          break;
        case 'funded-fail':
          subject = `Funded Account Status Update`;
          break;
        case 'funded-drawdown-warning':
          subject = `⚠️ Funded Account Warning - Please Review`;
          break;
        case 'admin-pass-notification':
          subject = `Admin Alert: User Passed Challenge`;
          break;
        case 'admin-fail-notification':
          subject = `Admin Alert: User Failed Challenge`;
          break;
        default:
          subject = 'Exodus Notification';
      }
    } else {
      // Generate email based on type
      switch (type) {
        case 'pass':
          subject = `🎉 Congratulations! You've Passed Your ${step || 'Challenge'}!`;
          htmlContent = generatePassEmail(name, challengeType, accountSize, step);
          break;
        
        case 'fail':
          subject = `Challenge Update - ${challengeType}`;
          htmlContent = generateFailEmail(name, challengeType, accountSize, breachType, maxDrawdown, dailyDrawdown);
          break;
        
        case 'drawdown-warning':
          subject = `⚠️ Drawdown Warning - Action Required`;
          htmlContent = generateDrawdownWarningEmail(name, challengeType, accountSize, currentDrawdown);
          break;
        
        case 'funded-pass':
          subject = `🎊 Congratulations! Your Funded Account Is Ready!`;
          htmlContent = generateFundedPassEmail(name, accountSize);
          break;
        
        case 'funded-fail':
          subject = `Funded Account Status Update`;
          htmlContent = generateFundedFailEmail(name, accountSize, breachType, maxDrawdown, dailyDrawdown, accountType || '1-step');
          break;
        
        case 'funded-drawdown-warning':
          subject = `⚠️ Funded Account Warning - Please Review`;
          htmlContent = generateFundedDrawdownWarningEmail(name, accountSize, currentDrawdown, warningType, accountType || '1-step');
          break;
        
        case 'admin-pass-notification':
          subject = `Admin Alert: User Passed Challenge`;
          htmlContent = generateAdminPassNotification(name, email, challengeType, accountSize, maxDrawdown, dailyDrawdown);
          break;
        
        case 'admin-fail-notification':
          subject = `Admin Alert: User Failed Challenge`;
          htmlContent = generateAdminFailNotification(name, email, challengeType, accountSize, maxDrawdown, dailyDrawdown);
          break;
        
        default:
          return NextResponse.json(
            { error: `Unknown email type: ${type}` },
            { status: 400 }
          );
      }
    }

    // Send email
    const result = await resend.emails.send({
      from: 'Exodus <support@exodusprop.com>',
      to: type.includes('admin') ? [adminEmail || 'support@exodusprop.com'] : [email],
      subject: subject,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error sending challenge email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

// Email template functions
function generatePassEmail(name: string, challengeType: string, accountSize: number, step: string): string {
  const displayChallengeType = challengeType === '1-step' ? 'Exodus 1-Step' : challengeType;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Challenge Passed!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 50px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: bold;">🎉 Congratulations!</h1>
              <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 20px;">You've Passed Your ${step}!</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <p style="color: #1a1a1a; font-size: 18px; line-height: 1.6; margin: 0 0 25px 0;">
                Hello <strong style="color: #059669;">${name}</strong>,
              </p>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.7; margin: 0 0 30px 0;">
                Amazing work! You have successfully passed your <strong>${displayChallengeType}</strong> challenge with a <strong>$${accountSize.toLocaleString()}</strong> account. Your dedication and skill have paid off!
              </p>
              
              <!-- Success Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; margin-bottom: 35px;">
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <p style="color: #047857; font-size: 16px; font-weight: 600; margin: 0 0 10px 0;">✅ Challenge Status</p>
                    <p style="color: #065f46; font-size: 28px; font-weight: bold; margin: 0;">PASSED</p>
                  </td>
                </tr>
              </table>
              
              <p style="color: #1a1a1a; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">
                📋 What's Next:
              </p>
              <ol style="color: #4a5568; font-size: 15px; line-height: 1.8; margin: 0 0 35px 0; padding-left: 25px;">
                <li style="margin-bottom: 8px;">Our team will review your trading performance</li>
                <li style="margin-bottom: 8px;">You'll receive your funded account credentials within 24-48 hours</li>
                <li style="margin-bottom: 8px;">Continue to trade with discipline and follow the rules</li>
                <li>Get ready to earn real profits! 💰</li>
              </ol>
              
              <!-- Support Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <p style="color: #1e40af; font-size: 15px; font-weight: 700; margin: 0 0 10px 0;">Need Assistance?</p>
                    <p style="color: #475569; font-size: 14px; line-height: 1.7; margin: 0;">
                      Our support team is here to help you:<br>
                      📧 <a href="mailto:support@exodusprop.com" style="color: #1e40af; text-decoration: none; font-weight: 600;">support@exodusprop.com</a>
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 0;">
                Keep up the excellent work, and we look forward to seeing your continued success!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 35px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 13px; margin: 0 0 8px 0;">
                © 2024 Exodus. All rights reserved.
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

function generateFailEmail(name: string, challengeType: string, accountSize: number, breachType: string, maxDrawdown: number, dailyDrawdown: number): string {
  const displayChallengeType = challengeType === '1-step' ? 'Exodus 1-Step' : challengeType;
  
  // Exodus Challenge Rules
  const maxDDLimit = 6; // 6% static max drawdown
  const dailyDDLimit = 4; // 4% daily loss limit
  
  // Determine specific breach details
  let breachDetails = '';
  let breachSpecifics = '';
  
  if (breachType === 'maxDrawdown' || maxDrawdown > maxDDLimit) {
    breachDetails = 'Maximum Drawdown Limit (Static)';
    breachSpecifics = `<li><strong style="color: #dc2626;">Your Maximum Drawdown:</strong> ${maxDrawdown?.toFixed(2) || 'N/A'}%</li>
                      <li><strong>Maximum Allowed:</strong> ${maxDDLimit}% (static from initial balance)</li>`;
  } else if (breachType === 'dailyDrawdown' || dailyDrawdown > dailyDDLimit) {
    breachDetails = 'Daily Loss Limit';
    breachSpecifics = `<li><strong style="color: #dc2626;">Your Daily Drawdown:</strong> ${dailyDrawdown?.toFixed(2) || 'N/A'}%</li>
                      <li><strong>Maximum Allowed:</strong> ${dailyDDLimit}%</li>`;
  } else if (breachType === 'both') {
    breachDetails = 'Multiple Trading Limits';
    breachSpecifics = `<li><strong style="color: #dc2626;">Your Maximum Drawdown:</strong> ${maxDrawdown?.toFixed(2) || 'N/A'}% (Limit: ${maxDDLimit}%)</li>
                      <li><strong style="color: #dc2626;">Your Daily Drawdown:</strong> ${dailyDrawdown?.toFixed(2) || 'N/A'}% (Limit: ${dailyDDLimit}%)</li>`;
  } else {
    breachDetails = 'Trading Objectives';
    breachSpecifics = '<li>Please review your account for specific details</li>';
  }
  
  let breachMessage = `We regret to inform you that your ${displayChallengeType} Challenge has been terminated due to breaching the <strong>${breachDetails}</strong>.`;
  if (breachType === 'both') {
    breachMessage = `Your account breached both the maximum drawdown (${maxDrawdown.toFixed(2)}%) and daily loss limit (${dailyDrawdown.toFixed(2)}%).`;
  } else if (breachType === 'maxDrawdown') {
    breachMessage = `Your account exceeded the maximum static drawdown limit at ${maxDrawdown.toFixed(2)}%.`;
  } else if (breachType === 'dailyDrawdown') {
    breachMessage = `Your account exceeded the daily loss limit at ${dailyDrawdown.toFixed(2)}%.`;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Challenge Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 50px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">Challenge Update</h1>
              <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 18px;">Account Status Notification</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <p style="color: #1a1a1a; font-size: 18px; line-height: 1.6; margin: 0 0 25px 0;">
                Hello <strong>${name}</strong>,
              </p>
              
              <div style="margin-bottom: 30px; padding: 20px; background-color: #fef2f2; border: 2px solid #fecaca; border-radius: 8px;">
                <p style="margin: 0 0 10px 0;"><strong>Hello ${name},</strong></p>
                <p style="margin: 0; color: #991b1b;">${breachMessage}</p>
              </div>
              
              <!-- Breach Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff5f5; border-left: 4px solid #dc2626; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="color: #dc2626; font-size: 18px; margin: 0 0 15px 0;">❌ Breach Details</h2>
                    <ul style="margin: 0; padding-left: 20px; line-height: 1.8; color: #4a5568;">
                      ${breachSpecifics}
                    </ul>
                  </td>
                </tr>
              </table>
              
              <!-- Account Information Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 15px 0;">Challenge Information</h2>
                    <p style="margin: 0 0 5px 0; color: #4a5568;"><strong>Challenge Type:</strong> ${displayChallengeType}</p>
                    <p style="margin: 0 0 5px 0; color: #4a5568;"><strong>Account Size:</strong> $${accountSize.toLocaleString()}</p>
                    <p style="margin: 0; color: #dc2626;"><strong>Status:</strong> <span style="font-weight: bold;">FAILED</span></p>
                  </td>
                </tr>
              </table>
              
              <!-- Challenge Rules Reminder -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <p style="color: #1e40af; font-size: 15px; font-weight: 700; margin: 0 0 12px 0;">📊 Exodus 1-Step Challenge Rules:</p>
                    <ul style="color: #475569; font-size: 14px; line-height: 1.7; margin: 0; padding-left: 20px;">
                      <li>Maximum Drawdown: <strong>6%</strong> (static from initial balance)</li>
                      <li>Daily Loss Limit: <strong>4%</strong></li>
                      <li>Profit Target: <strong>8%</strong></li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <p style="color: #1a1a1a; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">
                💪 Ready to Try Again?
              </p>
              <p style="color: #4a5568; font-size: 15px; line-height: 1.7; margin: 0 0 25px 0;">
                Don't let this setback discourage you! Many successful traders have faced challenges before finding their rhythm. We encourage you to:
              </p>
              <ul style="color: #4a5568; font-size: 15px; line-height: 1.8; margin: 0 0 30px 0; padding-left: 25px;">
                <li style="margin-bottom: 8px;">Review your trading strategy and risk management</li>
                <li style="margin-bottom: 8px;">Consider starting a new challenge when you're ready</li>
                <li style="margin-bottom: 8px;">Learn from this experience to become a better trader</li>
              </ul>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://exodusprop.com/purchase" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #60A5FA 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Start a New Challenge
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Support Section -->
              <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 0;">
                Have questions? Our support team is here to help:<br>
                📧 <a href="mailto:support@exodusprop.com" style="color: #1e40af; text-decoration: none; font-weight: 600;">support@exodusprop.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 35px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                © 2024 Exodus. All rights reserved.
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

function generateDrawdownWarningEmail(name: string, challengeType: string, accountSize: number, currentDrawdown: number): string {
  // Exodus Challenge Rules
  const maxDDLimit = 6; // 6% static max drawdown
  const dailyDDLimit = 4; // 4% daily loss limit
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Drawdown Warning</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); padding: 50px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">⚠️ Drawdown Warning</h1>
              <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 18px;">Action Required</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <p style="color: #1a1a1a; font-size: 18px; line-height: 1.6; margin: 0 0 25px 0;">
                Hello <strong>${name}</strong>,
              </p>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.7; margin: 0 0 30px 0;">
                This is an important notification regarding your trading account. Your current drawdown is approaching the maximum limit.
              </p>
              
              <!-- Warning Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <p style="color: #92400e; font-size: 15px; font-weight: 700; margin: 0 0 10px 0;">⚠️ Risk Management Alert</p>
                    <p style="color: #78350f; font-size: 14px; line-height: 1.7; margin: 0 0 15px 0;">
                      Your account drawdown is currently at <strong>${currentDrawdown.toFixed(2)}%</strong>. You're approaching the maximum limits:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px; line-height: 1.8;">
                      <li><strong>Maximum Drawdown Limit:</strong> ${maxDDLimit}% (static from initial balance)</li>
                      <li><strong>Daily Loss Limit:</strong> ${dailyDDLimit}%</li>
                    </ul>
                    <p style="margin: 15px 0 0 0; color: #92400e; font-weight: 600; font-size: 14px;">
                      ⚠️ Exceeding these limits will result in immediate challenge failure.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="color: #1a1a1a; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">
                🛡️ Recommended Actions:
              </p>
              <ul style="color: #4a5568; font-size: 15px; line-height: 1.8; margin: 0 0 30px 0; padding-left: 25px;">
                <li style="margin-bottom: 8px;"><strong>Review your open positions</strong> and consider reducing exposure</li>
                <li style="margin-bottom: 8px;"><strong>Implement strict stop losses</strong> on all trades</li>
                <li style="margin-bottom: 8px;"><strong>Reduce position sizes</strong> until your account recovers</li>
                <li style="margin-bottom: 8px;"><strong>Take a break</strong> if needed to reassess your strategy</li>
              </ul>
              
              <!-- Support Section -->
              <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 0;">
                Need help with risk management? Contact our support team:<br>
                📧 <a href="mailto:support@exodusprop.com" style="color: #1e40af; text-decoration: none; font-weight: 600;">support@exodusprop.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 35px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                © 2024 Exodus. All rights reserved.
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

function generateFundedPassEmail(name: string, accountSize: number): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Funded Account Ready!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); padding: 50px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: bold;">🎊 Congratulations!</h1>
              <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 20px;">Your Funded Account Is Ready!</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <p style="color: #1a1a1a; font-size: 18px; line-height: 1.6; margin: 0 0 25px 0;">
                Hello <strong style="color: #7c3aed;">${name}</strong>,
              </p>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.7; margin: 0 0 30px 0;">
                Amazing achievement! Your <strong>$${accountSize.toLocaleString()}</strong> funded account is now active and ready for trading. You're now trading with real capital and earning real profits!
              </p>
              
              <!-- Success Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fae8ff 0%, #e9d5ff 100%); border-radius: 12px; margin-bottom: 35px;">
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <p style="color: #6b21a8; font-size: 16px; font-weight: 600; margin: 0 0 10px 0;">💰 Account Status</p>
                    <p style="color: #581c87; font-size: 28px; font-weight: bold; margin: 0;">FUNDED & ACTIVE</p>
                  </td>
                </tr>
              </table>
              
              <p style="color: #1a1a1a; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">
                📋 Important Reminders:
              </p>
              <ul style="color: #4a5568; font-size: 15px; line-height: 1.8; margin: 0 0 35px 0; padding-left: 25px;">
                <li style="margin-bottom: 8px;">Maintain proper risk management (max 2% per trade)</li>
                <li style="margin-bottom: 8px;">Follow all funded account rules</li>
                <li style="margin-bottom: 8px;">Request payouts through your dashboard</li>
                <li>Keep trading with discipline and consistency</li>
              </ul>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://exodusprop.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Access Your Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 0;">
                Questions about your funded account?<br>
                📧 <a href="mailto:support@exodusprop.com" style="color: #1e40af; text-decoration: none; font-weight: 600;">support@exodusprop.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 35px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                © 2024 Exodus. All rights reserved.
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

function generateFundedFailEmail(name: string, accountSize: number, breachType: string, maxDrawdown: number, dailyDrawdown: number, accountType: string = '1-step'): string {
  // Funded Account Rules based on account type
  const isElite = accountType === 'elite';
  const fundedMaxDD = isElite ? null : 6; // 1-Step: 6% static, Elite: no limit
  const fundedDailyDD = isElite ? 10 : 4; // 1-Step: 4%, Elite: 10% trailing
  
  // Determine specific breach details
  let breachDetails = '';
  let breachSpecifics = '';
  
  if (isElite) {
    // Elite only has daily drawdown violations (no max DD)
    breachDetails = 'Daily Loss Limit Violation';
    breachSpecifics = `<li><strong style="color: #dc2626;">Your Daily Drawdown:</strong> ${dailyDrawdown?.toFixed(2) || 'N/A'}%</li>
                      <li><strong>Maximum Allowed:</strong> ${fundedDailyDD}% (Trailing EOD)</li>`;
  } else {
    // 1-Step can have max DD and/or daily DD violations
    if (breachType === 'maxDrawdown' || (fundedMaxDD && maxDrawdown > fundedMaxDD)) {
      breachDetails = 'Maximum Drawdown Limit';
      breachSpecifics = `<li><strong style="color: #dc2626;">Your Maximum Drawdown:</strong> ${maxDrawdown?.toFixed(2) || 'N/A'}%</li>
                        <li><strong>Maximum Allowed:</strong> ${fundedMaxDD}% (Static)</li>`;
    } else if (breachType === 'riskViolation' || (dailyDrawdown > fundedDailyDD)) {
      breachDetails = 'Daily Loss Limit Violation';
      breachSpecifics = `<li><strong style="color: #dc2626;">Your Daily Drawdown:</strong> ${dailyDrawdown?.toFixed(2) || 'N/A'}%</li>
                        <li><strong>Maximum Allowed:</strong> ${fundedDailyDD}%</li>`;
    } else if (breachType === 'both') {
      breachDetails = 'Multiple Rule Violations';
      breachSpecifics = `<li><strong style="color: #dc2626;">Your Maximum Drawdown:</strong> ${maxDrawdown?.toFixed(2) || 'N/A'}% (Limit: ${fundedMaxDD}%)</li>
                        <li><strong style="color: #dc2626;">Your Daily Drawdown:</strong> ${dailyDrawdown?.toFixed(2) || 'N/A'}% (Limit: ${fundedDailyDD}%)</li>`;
    } else {
      breachDetails = 'Funded Account Rules';
      breachSpecifics = '<li>Please review your account for specific details</li>';
    }
  }
  
  let breachMessage = `We regret to inform you that your ${isElite ? 'Elite' : '1-Step'} funded account has been terminated due to breaching <strong>${breachDetails}</strong>.`;
  if (breachType === 'both') {
    breachMessage = `Your funded account breached both the maximum drawdown (${maxDrawdown.toFixed(2)}%) and daily loss limits.`;
  } else if (breachType === 'maxDrawdown') {
    breachMessage = `Your funded account exceeded the maximum drawdown limit at ${maxDrawdown.toFixed(2)}%.`;
  } else if (breachType === 'riskViolation') {
    breachMessage = `Your funded account violated the daily loss limit with a drawdown of ${dailyDrawdown.toFixed(2)}%.`;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Funded Account Status Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 50px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">Funded Account Update</h1>
              <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 18px;">Important Status Notification</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <p style="color: #1a1a1a; font-size: 18px; line-height: 1.6; margin: 0 0 25px 0;">
                Hello <strong>${name}</strong>,
              </p>
              
              <div style="margin-bottom: 30px; padding: 20px; background-color: #fef2f2; border: 2px solid #fecaca; border-radius: 8px;">
                <p style="margin: 0 0 10px 0;"><strong>Hello ${name},</strong></p>
                <p style="margin: 0; color: #991b1b;">${breachMessage}</p>
              </div>
              
              <!-- Breach Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff5f5; border-left: 4px solid #dc2626; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="color: #dc2626; font-size: 18px; margin: 0 0 15px 0;">❌ Violation Details</h2>
                    <ul style="margin: 0; padding-left: 20px; line-height: 1.8; color: #4a5568;">
                      ${breachSpecifics}
                    </ul>
                  </td>
                </tr>
              </table>
              
              <!-- Funded Account Rules Reminder -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 15px 0;">${isElite ? 'Elite' : '1-Step'} Funded Account Rules Reminder</h2>
                    <ul style="margin: 0; padding-left: 20px; line-height: 1.8; color: #4a5568;">
                      ${isElite 
                        ? `<li><strong>Maximum Drawdown:</strong> None</li>
                           <li><strong>Daily Loss Limit:</strong> 10% (Trailing EOD)</li>`
                        : `<li><strong>Maximum Drawdown:</strong> 6% (Static)</li>
                           <li><strong>Daily Loss Limit:</strong> 4% maximum per day</li>`
                      }
                      <li><strong>Profit Target:</strong> ${isElite ? '10%' : '8%'} for evaluation completion</li>
                      <li><strong>Important:</strong> All risk parameters must be maintained at all times</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <p style="color: #1a1a1a; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">
                💪 What's Next?
              </p>
              <p style="color: #4a5568; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
                While this funded account has been closed, you can start a new challenge to earn another funded account. Learn from this experience and come back stronger!
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://exodusprop.com/purchase" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #60A5FA 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Start a New Challenge
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 0;">
                Questions? Contact our support team:<br>
                📧 <a href="mailto:support@exodusprop.com" style="color: #1e40af; text-decoration: none; font-weight: 600;">support@exodusprop.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 35px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                © 2024 Exodus. All rights reserved.
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

function generateFundedDrawdownWarningEmail(name: string, accountSize: number, currentDrawdown: number, warningType: string, accountType: string = '1-step'): string {
  // Funded Account Rules based on account type
  const isElite = accountType === 'elite';
  const fundedMaxDD = isElite ? null : 6; // 1-Step: 6%, Elite: none
  const fundedDailyDD = isElite ? 10 : 4; // 1-Step: 4%, Elite: 10% trailing
  
  let warningDetails = '';
  if (warningType === 'approaching-max') {
    if (isElite) {
      warningDetails = `Your current drawdown is ${currentDrawdown.toFixed(2)}%. Elite accounts have no maximum drawdown limit, but please maintain proper risk management.`;
    } else {
      warningDetails = `Your current drawdown is ${currentDrawdown.toFixed(2)}%, approaching the ${fundedMaxDD}% maximum limit.`;
    }
  } else {
    warningDetails = `Your current risk exposure is approaching critical levels. Please review your open positions and maintain proper risk management.`;
  }
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Funded Account Warning</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); padding: 50px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">⚠️ Funded Account Warning</h1>
              <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 18px;">Please Review Immediately</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <p style="color: #1a1a1a; font-size: 18px; line-height: 1.6; margin: 0 0 25px 0;">
                Hello <strong>${name}</strong>,
              </p>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.7; margin: 0 0 30px 0;">
                This is an important notification regarding your funded trading account.
              </p>
              
              <!-- Warning Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <p style="color: #92400e; font-size: 15px; font-weight: 700; margin: 0 0 10px 0;">⚠️ ${warningType === 'approaching-max' ? 'Approaching Maximum Drawdown' : 'Risk Management Alert'}</p>
                    <p style="color: #78350f; font-size: 14px; line-height: 1.7; margin: 0 0 15px 0;">
                      ${warningDetails}
                    </p>
                    <p style="color: #92400e; font-size: 14px; font-weight: 600; margin: 0 0 10px 0;">${isElite ? 'Elite' : '1-Step'} Funded Account Limits:</p>
                    <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px; line-height: 1.8;">
                      ${isElite 
                        ? `<li><strong>Maximum Drawdown:</strong> None</li>
                           <li><strong>Daily Loss Limit:</strong> ${fundedDailyDD}% (Trailing EOD)</li>`
                        : `<li><strong>Maximum Drawdown:</strong> ${fundedMaxDD}% (Static)</li>
                           <li><strong>Daily Loss Limit:</strong> ${fundedDailyDD}% maximum</li>`
                      }
                      <li><strong>Important:</strong> All risk parameters must be maintained at all times</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 0;">
                Need assistance? Contact our support team:<br>
                📧 <a href="mailto:support@exodusprop.com" style="color: #1e40af; text-decoration: none; font-weight: 600;">support@exodusprop.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 35px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                © 2024 Exodus. All rights reserved.
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

function generateAdminPassNotification(name: string, email: string, challengeType: string, accountSize: number, maxDrawdown: number, dailyDrawdown: number): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <tr>
            <td style="background-color: #059669; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🎉 User Passed Challenge</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <p style="color: #000000; font-size: 16px; margin: 0 0 20px 0;">
                <strong>A user has successfully passed their challenge:</strong>
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 2px solid #059669; border-radius: 8px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #000000; font-size: 18px; font-weight: bold; margin: 0 0 5px 0;">${name}</p>
                    <p style="color: #475569; font-size: 14px; margin: 0;">${email}</p>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #64748b; font-size: 13px; font-weight: 600;">Challenge Type:</td>
                  <td style="color: #000000; font-size: 14px; font-weight: 600; text-align: right;">${challengeType}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 13px; font-weight: 600;">Account Size:</td>
                  <td style="color: #000000; font-size: 14px; font-weight: 600; text-align: right;">$${accountSize.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 13px; font-weight: 600;">Max Drawdown:</td>
                  <td style="color: #000000; font-size: 14px; text-align: right;">${maxDrawdown.toFixed(2)}%</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 13px; font-weight: 600;">Daily Drawdown:</td>
                  <td style="color: #000000; font-size: 14px; text-align: right;">${dailyDrawdown.toFixed(2)}%</td>
                </tr>
              </table>
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

function generateAdminFailNotification(name: string, email: string, challengeType: string, accountSize: number, maxDrawdown: number, dailyDrawdown: number): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <tr>
            <td style="background-color: #dc2626; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">❌ User Failed Challenge</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <p style="color: #000000; font-size: 16px; margin: 0 0 20px 0;">
                <strong>A user has failed their challenge:</strong>
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #000000; font-size: 18px; font-weight: bold; margin: 0 0 5px 0;">${name}</p>
                    <p style="color: #475569; font-size: 14px; margin: 0;">${email}</p>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #64748b; font-size: 13px; font-weight: 600;">Challenge Type:</td>
                  <td style="color: #000000; font-size: 14px; font-weight: 600; text-align: right;">${challengeType}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 13px; font-weight: 600;">Account Size:</td>
                  <td style="color: #000000; font-size: 14px; font-weight: 600; text-align: right;">$${accountSize.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 13px; font-weight: 600;">Max Drawdown:</td>
                  <td style="color: #dc2626; font-size: 14px; text-align: right; font-weight: 600;">${maxDrawdown.toFixed(2)}%</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 13px; font-weight: 600;">Daily Drawdown:</td>
                  <td style="color: #dc2626; font-size: 14px; text-align: right; font-weight: 600;">${dailyDrawdown.toFixed(2)}%</td>
                </tr>
              </table>
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

