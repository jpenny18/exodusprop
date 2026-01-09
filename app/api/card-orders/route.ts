import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// POST: Create a new card order (when user clicks "Pay with Card")
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // Generate order ID if not provided
    const orderId = orderData.orderId || `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare document data
    const documentData = {
      ...orderData,
      orderId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    // Save to Firestore 'card-orders' collection
    await db.collection('card-orders').doc(orderId).set(documentData);
    
    // Also save to 'purchases' collection for backward compatibility with admin dashboard
    const purchaseData = {
      email: orderData.email,
      accountSize: orderData.accountSize,
      accountPrice: orderData.accountPrice,
      platform: orderData.platform,
      planId: orderData.planId,
      receiptId: orderId, // Use the card order ID as receipt
      billingInfo: orderData.billingInfo,
      timestamp: orderData.timestamp || new Date().toISOString(),
      status: orderData.status || 'pending',
      paymentMethod: 'card',
      source: 'checkout_form',
      cardOrderId: orderId, // Link back to card-orders collection
    };
    
    await db.collection('purchases').doc(orderId).set(purchaseData);
    
    console.log('[Card Orders API] Created order:', orderId);
    
    return NextResponse.json({ 
      success: true, 
      orderId,
      message: 'Card order created successfully' 
    });
  } catch (error) {
    console.error('[Card Orders API] Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create card order' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing card order (when payment completes)
export async function PUT(request: NextRequest) {
  try {
    const updateData = await request.json();
    const { orderId, ...fieldsToUpdate } = updateData;
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    // Add update timestamp
    const updatePayload = {
      ...fieldsToUpdate,
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    // Update in card-orders collection
    await db.collection('card-orders').doc(orderId).update(updatePayload);
    
    // Also update in purchases collection
    try {
      await db.collection('purchases').doc(orderId).update({
        status: fieldsToUpdate.status,
        receiptId: fieldsToUpdate.receiptId || orderId,
        completedAt: fieldsToUpdate.completedAt,
      });
    } catch (purchaseError) {
      console.log('[Card Orders API] Could not update purchases collection (may not exist):', purchaseError);
    }
    
    console.log('[Card Orders API] Updated order:', orderId, 'Status:', fieldsToUpdate.status);
    
    return NextResponse.json({ 
      success: true, 
      orderId,
      message: 'Card order updated successfully' 
    });
  } catch (error) {
    console.error('[Card Orders API] Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update card order' },
      { status: 500 }
    );
  }
}

// GET: Fetch card orders (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection('card-orders')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();
    
    const orders: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to ISO strings for JSON
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      });
    });
    
    return NextResponse.json({ 
      success: true, 
      orders,
      count: orders.length 
    });
  } catch (error) {
    console.error('[Card Orders API] Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch card orders' },
      { status: 500 }
    );
  }
}

