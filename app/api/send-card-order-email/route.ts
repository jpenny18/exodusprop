import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      orderId,
      email, 
      customerName, 
      accountSize, 
      accountPrice,
      platform,
      planType,
      billingInfo,
      status = 'pending'
    } = body;

    if (!email || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send admin notification email for pending card order
    const adminHtml = generatePendingOrderNotification({
      orderId,
      email,
      customerName,
      accountSize,
      accountPrice,
      platform,
      planType,
      billingInfo,
      status
    });
    
    await resend.emails.send({
      from: 'support@exodusprop.com',
      to: 'support@exodusprop.com',
      subject: `🔔 New Card Order Initiated: ${accountSize} - ${customerName}`,
      html: adminHtml,
    });

    console.log('[Card Order Email] Admin notification sent for order:', orderId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending card order email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

interface OrderDetails {
  orderId: string;
  email: string;
  customerName: string;
  accountSize: string;
  accountPrice: number;
  platform: string;
  planType: string;
  billingInfo?: {
    firstName: string;
    lastName: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  status: string;
}

function generatePendingOrderNotification(details: OrderDetails): string {
  const {
    orderId,
    email,
    customerName,
    accountSize,
    accountPrice,
    platform,
    planType,
    billingInfo,
    status
  } = details;

  const statusColor = status === 'pending' ? '#f59e0b' : '#16a34a';
  const statusText = status === 'pending' ? 'PAYMENT PENDING' : 'COMPLETED';
  const statusIcon = status === 'pending' ? '⏳' : '✅';

  const address = billingInfo 
    ? `${billingInfo.streetAddress}, ${billingInfo.city}, ${billingInfo.state} ${billingInfo.postalCode}, ${billingInfo.country}`
    : 'Not provided';

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
            <td style="background-color: ${statusColor}; padding: 25px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">${statusIcon} Card Order - ${statusText}</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <p style="color: #000000; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">
                ${status === 'pending' 
                  ? 'A customer has initiated a card payment checkout!' 
                  : 'A card payment has been completed!'}
              </p>
              <p style="color: #64748b; font-size: 13px; margin: 0 0 25px 0;">
                ${status === 'pending' 
                  ? 'They have filled out the form and are now on the Whop payment page. You will receive another email when payment completes.' 
                  : 'The payment has been processed successfully.'}
              </p>
              
              <!-- Status Badge -->
              <div style="background-color: ${status === 'pending' ? '#fef3c7' : '#dcfce7'}; border-left: 4px solid ${statusColor}; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="color: ${status === 'pending' ? '#92400e' : '#166534'}; font-size: 14px; font-weight: bold; margin: 0;">
                  Status: ${statusText}
                </p>
                <p style="color: ${status === 'pending' ? '#a16207' : '#15803d'}; font-size: 12px; margin: 5px 0 0 0;">
                  Order ID: ${orderId}
                </p>
              </div>
              
              <!-- Customer Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 2px solid #60A5FA; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px; background-color: #f8fafc;">
                    <p style="color: #1e40af; font-size: 14px; font-weight: bold; margin: 0 0 15px 0;">👤 Customer Information</p>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f8fafc; width: 35%;">Name:</td>
                        <td style="color: #000000; font-size: 14px; font-weight: 600; background-color: #f8fafc;">${customerName}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f8fafc;">Email:</td>
                        <td style="color: #000000; font-size: 14px; background-color: #f8fafc;">${email}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f8fafc;">Address:</td>
                        <td style="color: #000000; font-size: 13px; background-color: #f8fafc;">${address}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Order Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px; background-color: #f0fdf4;">
                    <p style="color: #166534; font-size: 14px; font-weight: bold; margin: 0 0 15px 0;">📦 Order Details</p>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f0fdf4; width: 35%;">Account Size:</td>
                        <td style="color: #1e40af; font-size: 18px; font-weight: bold; background-color: #f0fdf4;">${accountSize}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f0fdf4;">Plan Type:</td>
                        <td style="color: #000000; font-size: 14px; font-weight: 600; background-color: #f0fdf4;">${planType}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f0fdf4;">Platform:</td>
                        <td style="color: #000000; font-size: 14px; font-weight: 600; background-color: #f0fdf4;">${platform}</td>
                      </tr>
                      <tr>
                        <td style="color: #475569; font-size: 13px; font-weight: 600; background-color: #f0fdf4;">Payment Method:</td>
                        <td style="color: #000000; font-size: 14px; font-weight: 600; background-color: #f0fdf4;">CARD (via Whop)</td>
                      </tr>
                      <tr style="border-top: 2px solid #22c55e;">
                        <td style="color: #475569; font-size: 13px; font-weight: 600; padding-top: 12px; background-color: #f0fdf4;">Amount:</td>
                        <td style="color: #16a34a; font-size: 22px; font-weight: bold; padding-top: 12px; background-color: #f0fdf4;">$${accountPrice}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              ${status === 'pending' ? `
              <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="color: #92400e; font-size: 13px; margin: 0; font-weight: 600;">
                  ⏳ Awaiting Payment Completion
                </p>
                <p style="color: #a16207; font-size: 12px; margin: 5px 0 0 0;">
                  Customer is currently on the Whop payment page. This order will be marked complete when they finish paying.
                </p>
              </div>
              ` : `
              <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #1e40af;">
                <p style="color: #1e3a8a; font-size: 13px; margin: 0; font-weight: 600;">
                  ⚡ Action Required: Set up MT5 account and send credentials to customer
                </p>
              </div>
              `}
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 11px; margin: 0;">
                Admin Notification - Exodus | ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST
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

