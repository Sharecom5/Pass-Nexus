export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
}

export const blogs: BlogPost[] = [
  {
    title: "How to Use PassNexus for Your Next Event",
    slug: "how-to-use-passnexus",
    excerpt: "A complete step-by-step guide to setting up your first event, adding attendees, and generating zero-friction digital passes on PassNexus.",
    date: "2026-04-10",
    author: "PassNexus Team",
    category: "Getting Started",
    readTime: "5 min read",
    content: `
# How to Use PassNexus for Your Next Event

Setting up your event on PassNexus is designed to be incredibly fast. In under 5 minutes you can have a live registration page and start generating QR passes immediately.

## Step 1: Create Your Organizer Account

Visit passnexus.in and click "Get Started." Fill in your name, email, company name, and a secure password. Once registered, you are automatically on the Free Plan which allows 1 event and 10 passes.

## Step 2: Create Your First Event

Once inside the dashboard, click "Create New Event." You'll need to fill in:

- **Event Name** — the display name for your event
- **URL Slug** — a short, URL-safe identifier (e.g. tech-summit-2026)
- **Date and Venue** — visible on the attendee pass card
- **Gate Check-In PIN** — a 4-6 digit PIN your gate staff uses to unlock the scanner

## Step 3: Customize the Pass Layout

Under Pass Fields, toggle Name, Designation, Phone, and Company on or off based on what you want visible. You can also upload a custom background image (max 2MB) and use the sliders to position the QR code and info block precisely on your background.

## Step 4: Share Your Public Registration Link

Click the globe icon on your event card to copy the public registration URL. Share it via email, WhatsApp, or your event website. Attendees self-register in under 30 seconds and instantly receive a digital QR pass in their browser.

## Step 5: Gate Entry on Event Day

Click the green camera icon on your dashboard. Enter your Gate PIN. Use any laptop webcam or mobile browser — point it at each attendee's QR code. The scanner flashes green for valid passes and logs the check-in time automatically.

That is it. No physical tickets, no lengthy printing queues — just fast, secure digital access.
    `
  },
  {
    title: "How to Make Professional Digital Passes Like the Pros",
    slug: "how-to-make-digital-passes",
    excerpt: "Stop using paper tickets. Learn best practices for designing and deploying secure, beautiful QR code passes for conferences and meetups.",
    date: "2026-04-12",
    author: "PassNexus Team",
    category: "Design Tips",
    readTime: "6 min read",
    content: `
# How to Make Professional Digital Passes Like the Pros

Gone are the days of printing thousands of physical badges. Digital QR passes are cheaper, faster, and far more eco-friendly — and they look dramatically more premium.

## 1. Choose the Right Background Image

Your pass background sets the tone. Use a dark, high-contrast image so that text and QR codes are easy to read. Avoid busy patterns that conflict with the embedded text overlay. Resolution of 1200×1800px works best.

**Pro Tip:** Use a dark gradient overlay at the bottom of your background image where attendee info is placed. This ensures readable white text regardless of the image content.

## 2. Decide What Fields to Show

Not every pass needs every field. For a quick conference badge, Name + Company is usually enough for gate staff. For VIP passes you may also want Designation. Keep it clean — overcrowded passes look amateur.

## 3. Position the QR Code Thoughtfully

Using the PassNexus slider, place the QR code in the center of your design — not too close to any edge. Scanners need a clear scan zone. Leave at least 10% padding around the QR block.

## 4. Test Before the Event

Always do a dry run:
- Register a test attendee
- Pull up the pass
- Scan it with your gate scanner

This 3-minute check prevents a lot of day-of embarrassment.

## 5. Make Recovery Easy

PassNexus passes are permanently linked to the attendee's email. Even if someone forgets to screenshot their pass, they can recover it using their email from the public pass page. Train your gate staff to direct confused attendees to ask at the registration desk for a rescan.
    `
  },
  {
    title: "QR Code Event Check-In: The Complete 2026 Guide",
    slug: "qr-code-event-check-in-guide-2026",
    excerpt: "Everything you need to know about running a flawless QR code check-in for your event, from scanner setup to handling edge cases.",
    date: "2026-04-14",
    author: "PassNexus Team",
    category: "Event Operations",
    readTime: "8 min read",
    content: `
# QR Code Event Check-In: The Complete 2026 Guide

QR code check-in has become the gold standard for events of all sizes. Here is everything you need to set up a bulletproof gate operation.

## Why QR Check-In Beats Every Alternative

Paper lists require a staff member to manually search and cross off names — causing long delays and frequent human errors. Wristbands must be pre-printed and distributed. App-based check-in forces attendees to download something.

QR codes, by contrast:
- Work offline once the scanner is open
- Scan in under half a second
- Give instant visual feedback (green/red)
- Auto-log check-in timestamps to your dashboard

## Setting Up Your Gate Stations

For an event of 100-300 attendees, 1 scanner station is sufficient. Scale up:
- 300-1000 attendees: 2 scanner stations
- 1000+ attendees: 1 station per 500 expected arrivals

Make sure each station has a reliable cellular or Wi-Fi connection. The PassNexus scanner uses your default browser camera — no additional app required.

## Handling the Peak Rush

Most event arrivals cluster in the 15 minutes before start time. Tell attendees to have their pass QR code open before they reach the gate. Consider sending a reminder message 30 minutes before doors open.

## What to Do When a QR Code Fails

1. Try scanning again with better lighting
2. Ask the attendee to increase their screen brightness
3. Have the attendee share their Pass ID verbally — gate staff can look it up in the dashboard manually
4. If the pass is completely invalid, use the Instant Badge system to generate an emergency walk-in badge on the spot

## Know Your Stats in Real-Time

Your admin dashboard updates in real-time as attendees check in. The "Gate Checks" counter shows how many have entered. The "Pending Entry" number tells you how many registered passes are still outstanding.
    `
  },
  {
    title: "Free vs Paid Event Management Software: What You Actually Need",
    slug: "free-vs-paid-event-management-software",
    excerpt: "Is it worth paying for event management software? We break down what free tiers give you and when upgrading actually makes sense.",
    date: "2026-04-15",
    author: "PassNexus Team",
    category: "Buying Guides",
    readTime: "7 min read",
    content: `
# Free vs Paid Event Management Software: What You Actually Need

When evaluating event management tools, the instinct is to start free and upgrade only when you hit a wall. That strategy is smart — but only if you understand exactly where those walls are.

## What Free Plans Typically Include

Most freemium event platforms offer:
- 1 active event
- 10-50 attendee registrations
- Basic QR code generation
- No custom branding

PassNexus's free plan follows this model: 1 event, 10 passes, full feature access. It is genuinely useful for testing the system or running a small private gathering.

## When Free Plans Break Down

Free tiers fall apart when you host events with more than 50 attendees, run multiple events concurrently, or need white-label branding on your passes. At that scale, the cost of switching between free and a different tool every time far exceeds the price of a reasonable subscription.

## The Real Cost of Going Cheap

Hidden costs of free tools include:
- **Time** — Manual workarounds eat hours
- **Branding** — "Powered by [free tool]" on attendee passes hurts credibility
- **Support** — Free tiers rarely include priority support

## PassNexus Paid Tiers

The Starter plan unlocks 5 events and 100 passes — covering most small and medium organizers. Pro and Business tiers scale further with unlimited passes and advanced analytics. Every paid upgrade is processed instantly via Razorpay with no waiting for account managers.

## Our Recommendation

Start free. Run your first event. If you hit the pass limit, upgrade. The process takes 2 minutes through our in-dashboard upgrade flow.
    `
  },
  {
    title: "How to Manage Walk-In Attendees at Your Event",
    slug: "how-to-manage-walk-in-attendees",
    excerpt: "Walk-ins are unavoidable. Here is how to handle them gracefully without breaking your check-in flow or creating a queue at the gate.",
    date: "2026-04-16",
    author: "PassNexus Team",
    category: "Event Operations",
    readTime: "5 min read",
    content: `
# How to Manage Walk-In Attendees at Your Event

No matter how well you promote pre-registration, walk-in attendees will show up. Having a clear process ready saves you from chaos at the gate.

## The Problem With Walk-Ins

Walk-ins who haven't pre-registered create delays:
- Gate staff must manually verify they are legitimate
- Paper lists need to be updated
- Stats become inaccurate
- Walk-ins often look confused and hold up the queue

## The PassNexus Solution: Instant Badge

PassNexus has a dedicated Instant Badge system exactly for this scenario. Your gate staff (or a registration desk laptop) opens the Instant Badge tab in the admin panel and enters:

- Full Name
- Email Address
- Phone Number
- Company

In under 10 seconds, a badge is generated and the browser's print dialog launches automatically. The walk-in gets a clean, minimal badge printed from the nearest printer — and they are logged in the Walk-Ins Database immediately.

## Setting Up a Registration Desk

For events with high walk-in expectations:
1. Place a laptop at a registration table near the entrance
2. Log into your event admin panel
3. Keep the Instant Badge tab open
4. Assign one staff member specifically to handle walk-ins

## Tracking Walk-Ins Separately

All Instant Badge registrations are tagged with \`registrationSource: instant\`. Your Walk-Ins Database (inside the Instant Badge tab) shows all of them separately from pre-registered attendees — giving you accurate data for both groups.
    `
  },
  {
    title: "5 Common Event Pass Mistakes (And How to Avoid Them)",
    slug: "common-event-pass-mistakes",
    excerpt: "Avoid the classic pitfalls that trip up first-time event organizers when setting up digital passes and QR code check-in systems.",
    date: "2026-04-17",
    author: "PassNexus Team",
    category: "Best Practices",
    readTime: "6 min read",
    content: `
# 5 Common Event Pass Mistakes (And How to Avoid Them)

Even experienced organizers make preventable mistakes when setting up digital passes. Here are the five we see most often — and how to avoid them.

## Mistake 1: Testing the Scanner on Event Day

Never set up and test your QR scanner for the first time on the day of the event. Do a complete dry run 24 hours before:
- Register a test attendee
- Open the scanner
- Verify the green confirmation works
- Check that check-in timestamps appear

## Mistake 2: Using a Dark QR Code on a Dark Background

If your pass background is dark navy and your QR code renders in black, scanning will fail under dim lighting. Always use a white background behind the QR code block. PassNexus automatically wraps QR codes in a white container — but if you override CSS, be careful.

## Mistake 3: Not Having a Backup Plan

Technology fails. Have a contingency:
- A downloaded CSV of attendee names
- The Instant Badge generator ready on a second device
- A printed master list for the first 30 minutes if internet drops

## Mistake 4: Underestimating the Peak Rush

Most events see 60% of their total attendees arrive in the first 15 minutes. Run the math: if 200 people arrive in 15 minutes, you need to scan roughly 13 people per minute per station. Scale your scanner stations accordingly.

## Mistake 5: Forgetting to Tell Attendees to Download Their Pass

Automated emails go to spam. Remind attendees in a follow-up message 24 hours before the event: "Open your pass email and screenshot your QR code before you arrive." This one message dramatically reduces on-site confusion.
    `
  },
  {
    title: "How to Send Beautiful Event Confirmation Emails",
    slug: "how-to-send-event-confirmation-emails",
    excerpt: "The confirmation email is the first thing your attendee sees after registering. Make it count with these design and content best practices.",
    date: "2026-04-18",
    author: "PassNexus Team",
    category: "Email Marketing",
    readTime: "5 min read",
    content: `
# How to Send Beautiful Event Confirmation Emails

The event confirmation email is more than a receipt — it is your first real communication with the attendee after they have committed to your event. Make it count.

## What Every Confirmation Email Must Include

1. **Event name and date** — prominently at the top
2. **Venue and address** with a map link
3. **The QR code pass** — embedded directly, not hidden behind a link
4. **Pass ID** — attendees will use this if they lose the QR code
5. **Clear instructions** — "Show this at the gate"

## Design Principles That Work

Keep it clean. Confirmation emails should have a strong header, a single-column layout, and no more than 3 sections. Busy event emails with multiple banners and links get skimmed — or deleted.

Use white space generously. The QR code is the hero element — center it, give it room, and make it large.

## The PassNexus Approach

Every registration through PassNexus (public signup or manual entry) triggers an automatic HTML confirmation email via Resend. The email includes:

- A branded header with the event name
- The attendee's unique QR code
- Event date and venue info
- A "View My Pass" link
- A pass recovery reminder

All of this happens without you lifting a finger.

## Testing Your Email Templates

Before going live, always register a test attendee with your own email address. Check:

- Does the QR code render clearly?
- Is the layout consistent across Gmail, Outlook, and Apple Mail?
- Do the links work?

Email rendering varies wildly across clients — testing is non-negotiable.
    `
  },
  {
    title: "Event Data Privacy: What Organizers Need to Know",
    slug: "event-data-privacy-for-organizers",
    excerpt: "You collect attendee names, emails, and phone numbers. Here is what your legal obligations are and how PassNexus helps you stay compliant.",
    date: "2026-04-19",
    author: "PassNexus Team",
    category: "Compliance",
    readTime: "7 min read",
    content: `
# Event Data Privacy: What Organizers Need to Know in 2026

When you collect attendee registration data — names, emails, phone numbers — you take on legal responsibility for how that data is stored, used, and protected. Here is what you need to know.

## What Data Do You Actually Collect?

A typical event registration collects:
- Full name
- Email address
- Phone number
- Company / organization

PassNexus stores this data encrypted in isolated event silos — meaning data for Event A is never mixed with Event B, even within the same organizer account.

## Your Core Obligations

Regardless of jurisdiction, the basics are consistent:

**Transparency:** Tell attendees what you are collecting and why. Your registration page should include a brief privacy note.

**Minimization:** Only collect what you actually need. If you don't need phone numbers, disable that field.

**Retention Limits:** Do not keep attendee data indefinitely. After the event is over, consider exporting your data and requesting deletion.

**Security:** Use platforms that encrypt data at rest and in transit. PassNexus uses HTTPS and encrypted MongoDB storage.

## GDPR Considerations (EU Events)

If you host events attended by EU citizens, GDPR applies. Key requirements:
- Explicit consent at registration
- Right to erasure on request
- Data processing agreement with your tools

## India's DPDP Act

India's Digital Personal Data Protection Act (2023) is now in effect. Organizers processing Indian resident data must have a clear privacy policy and provide a grievance redressal mechanism.

## Best Practice Checklist

- [ ] Privacy notice on your registration page
- [ ] Only collecting necessary fields
- [ ] Export and delete data after the event
- [ ] Using a secure, encrypted platform (like PassNexus)
    `
  },
  {
    title: "How to Run a Hybrid Event with Digital Passes",
    slug: "how-to-run-hybrid-event-with-digital-passes",
    excerpt: "Hybrid events have both in-person and virtual attendees. Here is how to manage passes, registrations, and check-ins across both channels seamlessly.",
    date: "2026-04-20",
    author: "PassNexus Team",
    category: "Event Planning",
    readTime: "8 min read",
    content: `
# How to Run a Hybrid Event with Digital Passes

Hybrid events — where some attendees are in-person and others join virtually — are now the norm for conferences, product launches, and AGMs. Managing registrations and access across both channels requires a clear system.

## The Core Challenge

In a purely in-person event, every attendee needs a physical gate pass. In a hybrid event, you have two types of participants:

1. **In-person attendees** — need a QR code pass for gate entry
2. **Virtual attendees** — need a confirmation and login link for the virtual platform

These two cohorts often register through the same form but need fundamentally different experiences.

## Using PassNexus for Hybrid Events

PassNexus handles the in-person side natively. For a hybrid event, here is the recommended workflow:

**Step 1:** Create your event in PassNexus as normal.

**Step 2:** In your registration form description, add a field or note distinguishing in-person from virtual (e.g., via a Designation field where attendees enter "Virtual" or "In-Person").

**Step 3:** Use the CSV export to segment your attendee list. Filter for virtual attendees and send them your webinar/streaming platform link separately.

**Step 4:** In-person attendees receive their QR pass via the automated PassNexus email. Virtual attendees get their access link through your existing video conferencing tool.

## Managing Capacity

Use your Pass limit as your in-person capacity cap. Set the pass limit to your venue's capacity — PassNexus will automatically block new in-person registrations once you hit the limit.

## Day-of Logistics

- Gate: QR scanners for in-person attendees as normal
- Virtual room: Stream starts automatically at event time
- Staff: Assign one person to monitor both the scanner dashboard and the virtual chat

Hybrid events feel complex until you split the two audiences in your planning. Keep the systems separate and each becomes straightforward.
    `
  },
  {
    title: "How to Scale Your Event from 50 to 5,000 Attendees",
    slug: "how-to-scale-your-event",
    excerpt: "Growth is exciting until your systems start breaking. Here is a practical guide to scaling your event operations without losing quality.",
    date: "2026-04-21",
    author: "PassNexus Team",
    category: "Event Growth",
    readTime: "9 min read",
    content: `
# How to Scale Your Event from 50 to 5,000 Attendees

Scaling an event is an operational challenge as much as a marketing one. What works at 50 attendees collapses under the weight of 500. Here is how to build a system that scales.

## The Three Scaling Thresholds

**50-100 attendees:** One organizer can manage everything — registration, gate, communication — using a single tool.

**100-500 attendees:** You need delegation. At least one dedicated gate staff member, a separate registration desk, and automated email handling are non-negotiable.

**500+ attendees:** Multiple scanner stations, a volunteer or staff coordinator for each section, a dedicated troubleshooting tech, and real-time data visibility for your event director.

## Upgrade Your Pass Limit Before You Need To

The most common mistake is upgrading your plan after you have already hit the limit and new registrations are being turned away. Upgrade early — the moment you know your expected attendance will exceed your current tier.

## Scanner Station Planning

Run this formula:
- Expected arrivals in the first 20 minutes = (Total attendance × 0.6)
- Each scanner station can process approximately 15-20 people per minute
- Stations needed = Peak arrivals ÷ (15 × 20 minutes)

For a 1,000-person event, you likely need 2-3 stations.

## Communication at Scale

At 50 attendees, a personal WhatsApp message works. At 5,000, you need:
- Automated confirmation emails (PassNexus handles this)
- A reminder campaign 48 hours and 1 hour before
- FAQ page or chatbot for common attendee questions

## The Day-of War Room

For large events, designate a command hub — a table or room with:
- Real-time dashboard view open
- Communication channel to all staff
- Backup devices with the scanner pre-loaded
- Master CSV attendee list printed as fallback

With the right infrastructure, scaling from 50 to 5,000 is a matter of multiplying your systems — not rebuilding them from scratch.
    `
  }
];
