import { env } from "@/data/env/server";
import { getTierByPriceId, subscriptionTiers } from "@/data/subscriptionTiers";
import { UserSubscriptionTable } from "@/drizzle/schema";
import { updateUserSubscription } from "@/server/db/subscription";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await request.text(),
    request.headers.get("stripe-signature") as string,
    env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleDeleteSubscription(subscription);

      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleUpdateSubscription(subscription);
      break;
    }

    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleCreateSubscription(subscription);
      break;
    }

    default:
      // Unexpected event type
      return new Response("Unexpected event type", { status: 400 });
  }

  return new Response(null, { status: 200 });
}

async function handleCreateSubscription(subscription: Stripe.Subscription) {
  // Handle customer.subscription.created
  const tier = getTierByPriceId(subscription.items.data[0].price.id);
  const clerkUserId = subscription.metadata.clerkUserId;
  if (clerkUserId == null || tier == null) {
    return new Response(null, { status: 500 });
  }

  const customer = subscription.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;

  return await updateUserSubscription(
    eq(UserSubscriptionTable.clerkUserId, clerkUserId),
    {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      stripeSubscriptionItemId: subscription.items.data[0].id,
      tier: tier.name,
    },
  );
}

async function handleUpdateSubscription(subscription: Stripe.Subscription) {
  const tier = getTierByPriceId(subscription.items.data[0].price.id);
  const customer = subscription.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;
  if (tier == null) {
    return new Response(null, { status: 500 });
  }

  return await updateUserSubscription(
    eq(UserSubscriptionTable.stripeCustomerId, customerId),
    { tier: tier.name },
  );
}

async function handleDeleteSubscription(subscription: Stripe.Subscription) {
  const customer = subscription.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;

  return await updateUserSubscription(
    eq(UserSubscriptionTable.stripeCustomerId, customerId),
    {
      stripeSubscriptionId: null,
      stripeSubscriptionItemId: null,
      tier: subscriptionTiers.Free.name,
    },
  );
}
