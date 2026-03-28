import Razorpay from 'razorpay';

const key_id = process.env.RAZORPAY_KEY_ID || 'your-key-id';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'your-key-secret';

export const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export async function createRazorpayOrder(amount: number, currency: string = 'INR', receipt: string) {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
    });
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
}
