// This file is the backend
// in Next.js, each file has to have its own handler
            // json to make the response an object
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    // console.log(req.body[0].image[0]);

    const cartItems = req.body

    if (req.method === 'POST') {
        try {
            const params = {
                submit_type:'pay',
                mode: 'payment',
                payment_method_types: ['card'],
                billing_address_collection: 'auto',
                shipping_options: [
                    {shipping_rate: 'shr_1MXx2WE3AgfzC3xQlC7cCEP3'},
                    {shipping_rate: 'shr_1MXx3PE3AgfzC3xQCpNkRbcB'},

                ],
                line_items:cartItems.map((item) => {
                    const img = item.image[0].asset._ref;
                    const newImage = img.replace('image-', 'https://cdn.sanity.io/images/btt6s4au/production/').replace('-webp', '.webp');
                    // console.log('Image', newImage);

                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: item.name,
                                images: [newImage],
                            },
                            unit_amount:item.price*100,  //in cents
                        },
                        adjustable_quantity: {
                            enabled: true,
                            minimum: 1,
                        },
                        quantity: item.quantity,
                    }
                }),
                success_url: `${req.headers.origin}/success`,
                cancel_url: `${req.headers.origin}/canceled`,
                }
            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create(params);
            res.status(200).json(session);
        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}

