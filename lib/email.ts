import { Resend } from 'resend';
import { OrderData } from './firebase';

// Initialize Resend with API key (only used in server components/API routes)
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Format currency as USD
 * @param amount Amount to format
 * @returns Formatted amount string
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Send notification email to admin when a new order is placed
 * @param order Order details
 * @returns Email send result
 */
export async function sendAdminNotificationEmail(order: OrderData & { id?: string }) {
  try {
    console.log('Sending admin notification email for order:', order.id || 'unknown');
    
    const supportEmail = 'support@exodusprop.com';
    
    const { data, error } = await resend.emails.send({
      from: supportEmail,
      to: supportEmail,
      subject: `New Order: ${order.challengeType} Challenge (${order.challengeAmount})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #1e40af; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
            <h1 style="color: #60A5FA; margin: 0; font-size: 24px;">New Exodus Order</h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p style="margin-bottom: 5px;"><strong>Order ID:</strong> ${order.id || 'N/A'}</p>
            <p style="margin-bottom: 5px;"><strong>Payment ID:</strong> ${order.transactionId || order.paymentIntentId || 'N/A'}</p>
            <p style="margin-bottom: 5px;"><strong>Date:</strong> ${order.createdAt.toDate().toLocaleString()}</p>
            <p style="margin-bottom: 5px;"><strong>Status:</strong> ${order.paymentStatus}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #60A5FA; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Details</h2>
            <p style="margin-bottom: 5px;"><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
            <p style="margin-bottom: 5px;"><strong>Email:</strong> ${order.customerEmail}</p>
            <p style="margin-bottom: 5px;"><strong>Phone:</strong> ${order.phone}</p>
            <p style="margin-bottom: 5px;"><strong>Country:</strong> ${order.country}</p>
            ${order.discordUsername ? `<p style="margin-bottom: 5px;"><strong>Discord:</strong> ${order.discordUsername}</p>` : ''}
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #60A5FA; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Order Details</h2>
            <p style="margin-bottom: 5px;"><strong>Challenge Type:</strong> ${order.challengeType}</p>
            <p style="margin-bottom: 5px;"><strong>Account Size:</strong> ${order.challengeAmount}</p>
            <p style="margin-bottom: 5px;"><strong>Platform:</strong> ${order.platform}</p>
            <p style="margin-bottom: 5px;"><strong>Payment Method:</strong> ${order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cryptocurrency'}</p>
            <p style="margin-bottom: 5px;"><strong>Amount Paid:</strong> ${formatCurrency(order.totalAmount)}</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #666;">
            <p>This is an automated notification from Exodus.</p>
          </div>
        </div>
      `,
      text: `
        New Exodus Order
        
        Order ID: ${order.id || 'N/A'}
        Payment ID: ${order.transactionId || order.paymentIntentId || 'N/A'}
        Date: ${order.createdAt.toDate().toLocaleString()}
        Status: ${order.paymentStatus}
        
        Customer Details:
        Name: ${order.firstName} ${order.lastName}
        Email: ${order.customerEmail}
        Phone: ${order.phone}
        Country: ${order.country}
        ${order.discordUsername ? `Discord: ${order.discordUsername}` : ''}
        
        Order Details:
        Challenge Type: ${order.challengeType}
        Account Size: ${order.challengeAmount}
        Platform: ${order.platform}
        Payment Method: ${order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cryptocurrency'}
        Amount Paid: ${formatCurrency(order.totalAmount)}
      `,
    });

    if (error) {
      console.error('Error sending admin notification email:', error);
      return { success: false, error };
    }

    console.log('Admin email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error };
  }
}

/**
 * Send notification email for crypto order
 * @param order Crypto order details
 * @returns Email send result
 */
export async function sendCryptoOrderEmail(order: {
  id: string;
  status: string;
  cryptoType: string;
  cryptoAmount: string;
  cryptoAddress: string;
  usdAmount: number;
  verificationPhrase: string;
  challengeType: string;
  challengeAmount: string;
  platform: string;
  addOns?: string[];
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerCountry: string;
  customerDiscordUsername?: string;
  createdAt: string;
}) {
  try {
    console.log('Sending crypto order notification emails for:', order.id);
    
    const supportEmail = 'support@exodusprop.com';
    
    // Define add-on names mapping
    const addOnNames: { [key: string]: string } = {
      'no-min-days': 'No Min Trading Days',
      'profit-split-80': '80% Initial Profit Split',
      'leverage-500': '1:500 Leverage',
      'reward-150': '150% Reward'
    };
    
    // Send admin notification FIRST (like SC-SYSTEM does)
    const adminResult = await resend.emails.send({
      from: supportEmail,
      to: supportEmail,
      subject: order.status === 'COMPLETED' 
        ? `[CRYPTO CONFIRMED] ${order.challengeType} Challenge (${order.challengeAmount})`
        : `[NEW CRYPTO ORDER] ${order.challengeType} Challenge (${order.challengeAmount})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #1e40af; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
            <h1 style="color: #60A5FA; margin: 0; font-size: 24px;">
              ${order.status === 'COMPLETED' ? 'Crypto Payment Confirmed' : 'New Crypto Order Received'}
            </h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p style="margin-bottom: 5px;"><strong>Order ID:</strong> ${order.id}</p>
            <p style="margin-bottom: 5px;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p style="margin-bottom: 5px;"><strong>Status:</strong> ${order.status}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #60A5FA; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Details</h2>
            <p style="margin-bottom: 5px;"><strong>Name:</strong> ${order.customerName}</p>
            <p style="margin-bottom: 5px;"><strong>Email:</strong> ${order.customerEmail}</p>
            <p style="margin-bottom: 5px;"><strong>Phone:</strong> ${order.customerPhone}</p>
            <p style="margin-bottom: 5px;"><strong>Country:</strong> ${order.customerCountry}</p>
            ${order.customerDiscordUsername ? `<p style="margin-bottom: 5px;"><strong>Discord:</strong> ${order.customerDiscordUsername}</p>` : ''}
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #60A5FA; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Order Details</h2>
            <p style="margin-bottom: 5px;"><strong>Challenge Type:</strong> ${order.challengeType}</p>
            <p style="margin-bottom: 5px;"><strong>Account Size:</strong> ${order.challengeAmount}</p>
            <p style="margin-bottom: 5px;"><strong>Platform:</strong> ${order.platform}</p>
            ${order.addOns && order.addOns.length > 0 ? `
              <p style="margin-bottom: 5px;"><strong>Add-ons:</strong></p>
              <ul style="margin: 0 0 5px 20px; padding: 0;">
                ${order.addOns.map(addOn => `<li style="margin-bottom: 2px;">${addOnNames[addOn] || addOn}</li>`).join('')}
              </ul>
            ` : ''}
            <p style="margin-bottom: 5px;"><strong>Payment Method:</strong> Cryptocurrency (${order.cryptoType})</p>
            <p style="margin-bottom: 5px;"><strong>Crypto Amount:</strong> ${order.cryptoAmount} ${order.cryptoType}</p>
            <p style="margin-bottom: 5px;"><strong>USD Amount:</strong> $${order.usdAmount.toFixed(2)}</p>
            <p style="margin-bottom: 5px;"><strong>Wallet Address:</strong> ${order.cryptoAddress}</p>
            <p style="margin-bottom: 5px;"><strong>Verification Phrase:</strong> ${order.verificationPhrase}</p>
          </div>
        </div>
      `
    });

    // Send customer notification
    const customerResult = await resend.emails.send({
      from: supportEmail,
      to: order.customerEmail,
      subject: order.status === 'COMPLETED'
        ? `Payment Confirmed - Your Exodus ${order.challengeType} Challenge`
        : `Your Exodus ${order.challengeType} Challenge Order`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #1e40af; padding: 20px; margin-bottom: 20px; border-radius: 5px; text-align: center;">
            <h1 style="color: #60A5FA; margin: 0; font-size: 24px;">
              ${order.status === 'COMPLETED' ? 'Payment Confirmed!' : 'Thanks for your order!'}
            </h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p>Hello ${order.customerName.split(' ')[0]},</p>
            ${order.status === 'COMPLETED' 
              ? `<p>Great news! We've confirmed your crypto payment for the ${order.challengeType} Challenge. Your order is now being processed.</p>
                 <p>Due to high demand, please allow up to 1 hour for your login credentials to be generated. In some cases, this might take up to 24 hours.</p>`
              : `<p>Thank you for purchasing our ${order.challengeType} Challenge. We're excited to see how you perform!</p>
                 <p>We've received your crypto payment request and will verify the transaction. Once confirmed, we'll prepare your trading account credentials.</p>`
            }
          </div>
          
          <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Summary</h2>
            <p style="margin-bottom: 5px;"><strong>Order ID:</strong> ${order.id}</p>
            <p style="margin-bottom: 5px;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p style="margin-bottom: 5px;"><strong>Challenge Type:</strong> ${order.challengeType}</p>
            <p style="margin-bottom: 5px;"><strong>Account Size:</strong> ${order.challengeAmount}</p>
            <p style="margin-bottom: 5px;"><strong>Platform:</strong> ${order.platform}</p>
            ${order.addOns && order.addOns.length > 0 ? `
              <p style="margin-bottom: 5px;"><strong>Add-ons:</strong></p>
              <ul style="margin: 0 0 5px 20px; padding: 0;">
                ${order.addOns.map(addOn => `<li style="margin-bottom: 2px;">${addOnNames[addOn] || addOn}</li>`).join('')}
              </ul>
            ` : ''}
            <p style="margin-bottom: 5px;"><strong>Payment Amount:</strong> ${order.cryptoAmount} ${order.cryptoType}</p>
            <p style="margin-bottom: 5px;"><strong>USD Value:</strong> $${order.usdAmount.toFixed(2)}</p>
          </div>
          
          ${order.status !== 'COMPLETED' ? `
          <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Payment Verification Details</h2>
            <p style="margin-bottom: 5px;"><strong>Verification Phrase:</strong> <span style="font-family: monospace; background-color: #eee; padding: 2px 4px; border-radius: 3px;">${order.verificationPhrase}</span></p>
            <p style="margin-top: 10px; color: #666; font-size: 14px;">Please keep these details for your records. They help us match your payment to your order.</p>
          </div>
          ` : ''}
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #60A5FA; font-size: 18px; margin-bottom: 15px;">Next Steps</h2>
            
            ${order.status === 'COMPLETED' ? `
            <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
              <div style="background-color: #60A5FA; color: #fff; border-radius: 50%; width: 25px; height: 25px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">1</div>
              <div>
                <h3 style="margin: 0 0 5px 0; color: #333;">Receive Your Login Credentials</h3>
                <p style="margin: 0; color: #666;">We're preparing your login credentials now. You'll receive them in a separate email within 1-24 hours.</p>
              </div>
            </div>
            
            <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
              <div style="background-color: #60A5FA; color: #fff; border-radius: 50%; width: 25px; height: 25px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">2</div>
              <div>
                <h3 style="margin: 0 0 5px 0; color: #333;">Start Trading</h3>
                <p style="margin: 0; color: #666;">Once you receive your credentials, you can begin trading. Remember to follow the challenge rules!</p>
              </div>
            </div>
            ` : `
            <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
              <div style="background-color: #60A5FA; color: #fff; border-radius: 50%; width: 25px; height: 25px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">1</div>
              <div>
                <h3 style="margin: 0 0 5px 0; color: #333;">Payment Verification</h3>
                <p style="margin: 0; color: #666;">We'll verify your crypto payment. This usually takes 30-60 minutes.</p>
              </div>
            </div>
            
            <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
              <div style="background-color: #60A5FA; color: #fff; border-radius: 50%; width: 25px; height: 25px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">2</div>
              <div>
                <h3 style="margin: 0 0 5px 0; color: #333;">Receive Your Login Credentials</h3>
                <p style="margin: 0; color: #666;">Once payment is confirmed, we'll send your login credentials to this email address.</p>
              </div>
            </div>
            `}
          </div>
          
          <div style="margin-bottom: 30px;">
            <p>If you have any questions or need assistance, please contact our support team at <a href="mailto:${supportEmail}" style="color: #60A5FA;">${supportEmail}</a>.</p>
            <p style="margin-bottom: 0;">Best regards,</p>
            <p style="margin-top: 5px;"><strong>The Exodus Team</strong></p>
          </div>
          
          <div style="background-color: #1e40af; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #e0e0e0;">
            <p style="margin-bottom: 5px;">© ${new Date().getFullYear()} Exodus. All rights reserved.</p>
            <p style="margin: 0;">This is an automated email, please do not reply.</p>
          </div>
        </div>
      `
    });

    return {
      success: true,
      adminEmail: adminResult,
      customerEmail: customerResult
    };
  } catch (error) {
    console.error('Error sending crypto order emails:', error);
    return { success: false, error };
  }
}

/**
 * Send template-based email with variable replacement
 * @param template Email template object
 * @param user User object containing recipient details
 * @param testValues Optional test values to override template variables
 * @returns Email send result
 */
export async function sendTemplateEmail(
  template: {
    name: string;
    subject: string;
    body: string;
    variables: string[];
  },
  user: {
    email: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    [key: string]: any;
  },
  testValues?: { [key: string]: string }
) {
  try {
    console.log('Sending template email to:', user.email);
    
    // TODO: Replace with Exodus support email
    const supportEmail = 'support@exodus-funding.com';
    
    // Prepare variable values
    const variableValues: { [key: string]: string } = {};
    
    // Set default values from user object
    template.variables.forEach(variable => {
      switch (variable) {
        case 'firstName':
          variableValues[variable] = user.firstName || user.displayName?.split(' ')[0] || 'Valued Customer';
          break;
        case 'lastName':
          variableValues[variable] = user.lastName || user.displayName?.split(' ')[1] || '';
          break;
        case 'email':
          variableValues[variable] = user.email;
          break;
        case 'displayName':
          variableValues[variable] = user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Valued Customer';
          break;
        default:
          variableValues[variable] = user[variable] || `{{${variable}}}`;
      }
    });
    
    // Override with test values if provided
    if (testValues) {
      Object.keys(testValues).forEach(key => {
        if (testValues[key] && testValues[key].trim()) {
          variableValues[key] = testValues[key];
        }
      });
    }
    
    // Replace variables in subject and body
    let processedSubject = template.subject;
    let processedBody = template.body;
    
    Object.entries(variableValues).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedSubject = processedSubject.replace(regex, value);
      processedBody = processedBody.replace(regex, value);
    });
    
    // Enhanced HTML body with Exodus branding
    const styledBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6; background-color: #f5f5f5;">
        <!-- Header with Exodus Branding -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #60A5FA 100%); padding: 30px 20px; margin-bottom: 30px; border-radius: 12px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px;">EXODUS</h1>
          <p style="color: #e0e0e0; margin: 5px 0 0 0; font-size: 14px; font-weight: 500; letter-spacing: 2px;">PROP FIRM</p>
        </div>
        
        <!-- Main Content -->
        <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e5e5e5;">
          ${processedBody}
        </div>
        
        <!-- Footer -->
        <div style="background: #f7f7f7; padding: 25px 20px; border-radius: 12px; text-align: center; font-size: 14px; color: #999;">
          <div style="margin-bottom: 15px;">
            <p style="margin: 0; color: #1a1a1a; font-weight: 600; font-size: 16px;">EXODUS</p>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">© ${new Date().getFullYear()} All rights reserved.</p>
          </div>
          <div style="border-top: 1px solid #ddd; padding-top: 15px;">
            <p style="margin: 0 0 10px 0; color: #666;">This is an automated email. Please do not reply to this message.</p>
            <p style="margin: 0; font-size: 12px;">
              Need help? Contact us at <a href="mailto:${supportEmail}" style="color: #60A5FA; text-decoration: none; font-weight: 500;">${supportEmail}</a>
            </p>
          </div>
        </div>
      </div>
    `;
    
    // Create text version by stripping HTML
    const textBody = processedBody
      .replace(/<[^>]*>/g, '')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
    
    // Send customer email
    const { data, error } = await resend.emails.send({
      from: `Exodus <${supportEmail}>`,
      to: user.email,
      subject: processedSubject,
      html: styledBody,
      text: `
        ${processedSubject}
        
        ${textBody}
        
        ---
        © ${new Date().getFullYear()} Exodus. All rights reserved.
        This is an automated email. Please do not reply to this message.
        Need help? Contact us at ${supportEmail}
      `,
    });

    if (error) {
      console.error('Error sending template email:', error);
      return { success: false, error };
    }

    console.log('Template email sent successfully:', data?.id);
    
    return { success: true, data };
  } catch (error) {
    console.error('Error sending template email:', error);
    return { success: false, error };
  }
}

/**
 * Send funded account fail email
 * @param data Email data for funded account failure
 * @returns Email send result
 */
export async function sendFundedFailEmail(data: {
  email: string;
  name: string;
  accountSize: number;
  breachType: 'maxDrawdown' | 'riskViolation' | 'both';
  maxDrawdown?: number;
  dailyDrawdown?: number;
}) {
  try {
    // TODO: Replace with Exodus support email
    const supportEmail = 'support@exodus-funding.com';
    
    const subject = 'Your Funded Account Has Been Terminated';
    
    let breachDetails = '';
    if (data.breachType === 'maxDrawdown') {
      breachDetails = `You exceeded the maximum drawdown limit (current: ${data.maxDrawdown?.toFixed(2)}%).`;
    } else if (data.breachType === 'riskViolation') {
      breachDetails = `You violated the risk management rules. Loss: ${data.dailyDrawdown?.toFixed(2)}%.`;
    } else {
      breachDetails = `You violated multiple rules: Maximum drawdown exceeded (${data.maxDrawdown?.toFixed(2)}%) and risk management violation (loss: ${data.dailyDrawdown?.toFixed(2)}%).`;
    }
    
    const result = await resend.emails.send({
      from: `Exodus <${supportEmail}>`,
      to: data.email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #1e40af; padding: 20px; margin-bottom: 20px; border-radius: 5px; text-align: center;">
            <h1 style="color: #FF4444; margin: 0; font-size: 24px;">Funded Account Terminated</h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p>Hello ${data.name},</p>
            <p>We regret to inform you that your funded account ($${data.accountSize.toLocaleString()}) has been terminated due to rule violations.</p>
          </div>
          
          <div style="margin-bottom: 30px; background-color: #fee; padding: 15px; border-radius: 5px; border-left: 4px solid #f44;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Violation Details</h2>
            <p style="margin: 0; color: #666;">${breachDetails}</p>
          </div>
          
          <div style="margin-top: 40px;">
            <p style="margin-bottom: 0;">Best regards,</p>
            <p style="margin-top: 5px;"><strong>The Exodus Team</strong></p>
          </div>
          
          <div style="background-color: #1e40af; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #e0e0e0; margin-top: 40px;">
            <p style="margin-bottom: 5px;">© ${new Date().getFullYear()} Exodus. All rights reserved.</p>
            <p style="margin: 0;">This is an automated email, please do not reply.</p>
          </div>
        </div>
      `,
      text: `
        Funded Account Terminated
        
        Hello ${data.name},
        
        We regret to inform you that your funded account ($${data.accountSize.toLocaleString()}) has been terminated due to rule violations.
        
        Violation Details:
        ${breachDetails}
        
        Best regards,
        The Exodus Team
      `,
    });

    if ('error' in result && result.error) {
      console.error('Error sending funded fail email:', result.error);
      return { success: false, error: result.error };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending funded fail email:', error);
    return { success: false, error };
  }
}

/**
 * Send funded account drawdown warning email
 * @param data Email data for funded account warning
 * @returns Email send result
 */
export async function sendFundedDrawdownWarningEmail(data: {
  email: string;
  name: string;
  accountSize: number;
  currentDrawdown: number;
  warningType: 'approaching-max' | 'approaching-risk-limit';
}) {
  try {
    // TODO: Replace with Exodus support email
    const supportEmail = 'support@exodus-funding.com';
    
    const subject = data.warningType === 'approaching-max' 
      ? 'Warning: Approaching Maximum Drawdown Limit'
      : 'Warning: Approaching Risk Management Violation';
    
    const warningDetails = data.warningType === 'approaching-max'
      ? `Your current drawdown is ${data.currentDrawdown.toFixed(2)}%, approaching your maximum limit.`
      : `Your current risk exposure is approaching dangerous levels. Please review your open positions.`;
    
    const result = await resend.emails.send({
      from: `Exodus <${supportEmail}>`,
      to: data.email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #1e40af; padding: 20px; margin-bottom: 20px; border-radius: 5px; text-align: center;">
            <h1 style="color: #FFA500; margin: 0; font-size: 24px;">Risk Warning</h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p>Hello ${data.name},</p>
            <p>This is an important risk management alert for your funded account ($${data.accountSize.toLocaleString()}).</p>
          </div>
          
          <div style="margin-bottom: 30px; background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Warning Details</h2>
            <p style="margin: 0; color: #666;">${warningDetails}</p>
          </div>
          
          <div style="margin-top: 40px;">
            <p>Stay disciplined and protect your funded account.</p>
            <p style="margin-bottom: 0;">Best regards,</p>
            <p style="margin-top: 5px;"><strong>The Exodus Team</strong></p>
          </div>
          
          <div style="background-color: #1e40af; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #e0e0e0; margin-top: 40px;">
            <p style="margin-bottom: 5px;">© ${new Date().getFullYear()} Exodus. All rights reserved.</p>
            <p style="margin: 0;">This is an automated risk management notification.</p>
          </div>
        </div>
      `,
      text: `
        Risk Warning
        
        Hello ${data.name},
        
        This is an important risk management alert for your funded account ($${data.accountSize.toLocaleString()}).
        
        Warning Details:
        ${warningDetails}
        
        Stay disciplined and protect your funded account.
        
        Best regards,
        The Exodus Team
      `,
    });

    if ('error' in result && result.error) {
      console.error('Error sending funded drawdown warning email:', result.error);
      return { success: false, error: result.error };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending funded drawdown warning email:', error);
    return { success: false, error };
  }
}

