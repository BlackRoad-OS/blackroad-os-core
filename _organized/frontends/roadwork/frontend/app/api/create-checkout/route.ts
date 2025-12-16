import { NextRequest, NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Pricing plans
const PLANS = {
  free: {
    price: 0,
    priceId: null,
  },
  pro: {
    price: 2999, // $29.99
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
  },
  premium: {
    price: 9999, // $99.99
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_placeholder',
  },
};

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json();

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];

    if (plan === 'free') {
      // Free plan - just create account
      return NextResponse.json({
        success: true,
        plan: 'free',
        message: 'Free account created',
      });
    }

    // For paid plans, create Stripe checkout session
    if (!STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Payment processing not configured' },
        { status: 500 }
      );
    }

    // Initialize Stripe
    const stripe = require('stripe')(STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://roadwork.blackroad.io'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://roadwork.blackroad.io'}/signup?canceled=true`,
      metadata: {
        plan,
        email,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
