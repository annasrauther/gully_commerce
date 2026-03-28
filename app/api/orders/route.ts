import { NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, address, productId, amount } = body;

    if (!name || !phone || !address || !productId || !amount) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch product and store details
    const { data: product } = await supabase
      .from('products')
      .select('store_id, title, price')
      .eq('id', productId)
      .single();

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // 2. Create order in Razorpay
    const rpOrder = await createRazorpayOrder(amount, 'INR', `receipt_${Date.now()}`);

    // 3. Create order in Supabase
    const { data: order, error: insertError } = await supabase
      .from('orders')
      .insert({
        store_id: product.store_id,
        product_id: productId,
        buyer_name: name,
        buyer_phone: phone,
        buyer_address: address,
        total_amount: amount,
        payment_status: 'pending',
        razorpay_order_id: rpOrder.id,
      })
      .select()
      .single();
        
    if (insertError) {
      console.error('Supabase insert failed:', insertError);
      return NextResponse.json({ message: 'Failed to create order in database' }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: rpOrder.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Error in /api/orders:', error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
