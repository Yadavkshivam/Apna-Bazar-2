import stripe from 'stripe'

const Stripe = stripe(process.env.STRIPE_SECRET_KEY)

if(!Stripe){
    console.log('Please provide stripe secret key in env file');
}

export default Stripe