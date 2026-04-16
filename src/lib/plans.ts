// Central source of truth for all plan limits
// Update here and it applies everywhere automatically

export type PlanId = 'free' | 'starter' | 'pro' | 'business' | 'enterprise';

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: string;
  priceValue: number; // in INR
  period: string;
  description: string;
  eventLimit: number;   // -1 = unlimited
  passLimit: number;    // -1 = unlimited
  features: string[];
  highlight: boolean;
  cta: string;
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    price: '₹0',
    priceValue: 0,
    period: 'forever',
    description: 'Try PassNexus with no commitment.',
    eventLimit: 1,
    passLimit: 10,
    features: [
      '1 Event',
      '10 Passes',
      'QR Pass Generation',
      'Pass Recovery Portal',
      'Email Delivery',
    ],
    highlight: false,
    cta: 'Start Free',
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: '₹4,999',
    priceValue: 4999,
    period: 'one-time',
    description: 'Perfect for small seminars and workshops.',
    eventLimit: 1,
    passLimit: 300,
    features: [
      '1 Event',
      '300 Passes',
      'QR Pass Generation',
      'Email Delivery',
      'Pass Recovery Portal',
      'CSV Export',
    ],
    highlight: false,
    cta: 'Buy Starter',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: '₹9,999',
    priceValue: 9999,
    period: 'one-time',
    description: 'For mid-size conferences and conventions.',
    eventLimit: 3,
    passLimit: 1000,
    features: [
      '3 Events',
      '1,000 Passes',
      'Custom Pass Background',
      'Email Delivery',
      'Pass Recovery Portal',
      'CSV Export',
      'Priority Support',
    ],
    highlight: true,
    cta: 'Buy Pro',
  },
  business: {
    id: 'business',
    name: 'Business',
    price: '₹19,999',
    priceValue: 19999,
    period: 'one-time',
    description: 'For large expos, trade shows and summits.',
    eventLimit: 10,
    passLimit: 5000,
    features: [
      '10 Events',
      '5,000 Passes',
      'Custom Branding',
      'Email Delivery',
      'CSV Export',
      'WhatsApp Integration',
      'Dedicated Support',
    ],
    highlight: false,
    cta: 'Buy Business',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: '₹39,999+',
    priceValue: 39999,
    period: 'custom',
    description: 'Unlimited usage for event management companies.',
    eventLimit: -1,
    passLimit: -1,
    features: [
      'Unlimited Events',
      'Unlimited Passes',
      'White-label Portal',
      'Custom Domain',
      'Self-host Option',
      'SLA Support',
    ],
    highlight: false,
    cta: 'Contact Sales',
  },
};

// Helper: get limits for a given plan
export function getPlanLimits(plan: PlanId) {
  return PLANS[plan] ?? PLANS.free;
}

// Helper: check if a value exceeds plan limit (-1 = unlimited)
export function isWithinLimit(current: number, limit: number): boolean {
  if (limit === -1) return true;
  return current < limit;
}
