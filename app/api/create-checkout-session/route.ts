import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

// Make sure STRIPE_SECRET_KEY is defined
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

if (!stripeSecret) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment variables.");
}

if (!baseUrl) {
  throw new Error("Missing NEXT_PUBLIC_BASE_URL in environment variables.");
}

const stripe = new Stripe(stripeSecret, {
  apiVersion: "2023-08-16",
});

export async function POST(req: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Sample Product",
            },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error("Stripe Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
