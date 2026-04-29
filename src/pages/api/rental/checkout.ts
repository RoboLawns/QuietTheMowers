import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { amount, rentalRequestId } = body;

    // In production, create a Stripe Checkout Session here
    // const session = await stripe.checkout.sessions.create({...});
    // return new Response(JSON.stringify({ url: session.url }));

    // Dev: return mock checkout URL
    return new Response(JSON.stringify({
      url: `/api/rental/checkout-success?session_id=mock_${Date.now()}&rental_id=${rentalRequestId}`,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to create checkout' }), { status: 500 });
  }
};

// Stripe webhook for successful payment
export const GET: APIRoute = async ({ url, redirect }) => {
  const rentalId = url.searchParams.get('rental_id');
  return redirect(`/measure/rent?msg=payment_success&rental_id=${rentalId || ''}`);
};
