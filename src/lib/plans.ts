export type PlanId = 'free' | 'pro' | 'business' | 'enterprise';

export interface PlanLimits {
  id: PlanId;
  name: string;
  price: string;
  priceValue: number;
  period: string;
  description: string;
  eventLimit: number;
  passLimit: number;
  features: string[];
  highlight: boolean;
  cta: string;
}

export const PLANS: Record<PlanId, PlanLimits> = {
  free: {
    id: 'free',
    name: 'Standard',
    price: 'Free',
    priceValue: 0,
    period: 'forever',
    description: 'Perfect for small communities and individual meetups.',
    eventLimit: 1,
    passLimit: 50,
    features: [
      '1 Active Event',
      '50 Digital Passes',
      'QR Verification',
      'Basic Email Support',
    ],
    highlight: false,
    cta: 'Get Started',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: '$99',
    priceValue: 99,
    period: 'one-time',
    description: 'For corporate events and business conferences.',
    eventLimit: 5,
    passLimit: 500,
    features: [
      '5 Active Events',
      '500 Digital Passes',
      'CSV Bulk Generation',
      'Custom Pass Types',
      'Priority Email Support',
    ],
    highlight: true,
    cta: 'Choose Pro',
  },
  business: {
    id: 'business',
    name: 'Business',
    price: '$249',
    priceValue: 249,
    period: 'one-time',
    description: 'For large expos and recurring events.',
    eventLimit: 15,
    passLimit: 2500,
    features: [
      '15 Active Events',
      '2,500 Digital Passes',
      'Team Access',
      'Full Export Control',
      'Dedicated Manager',
    ],
    highlight: false,
    cta: 'Choose Business',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    priceValue: 999,
    period: 'per year',
    description: 'Unlimited power for high-volume event companies.',
    eventLimit: -1,
    passLimit: -1,
    features: [
      'Unlimited Events',
      'Unlimited Passes',
      'White-label Scanning',
      'API Integration',
      'On-site Training',
    ],
    highlight: false,
    cta: 'Sales Inquiry',
  },
};

export function getPlanLimits(planId: PlanId): PlanLimits {
  return PLANS[planId] || PLANS.free;
}

export function isWithinLimit(current: number, limit: number): boolean {
  if (limit === -1) return true;
  return current < limit;
}
