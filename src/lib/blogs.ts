export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
}

export const blogs: BlogPost[] = [
  {
    title: "How to Use PassNexus for Your Next Event",
    slug: "how-to-use-passnexus",
    excerpt: "A complete step-by-step guide to setting up your first event, adding attendees, and generating zero-friction digital passes on PassNexus.",
    date: "2026-04-10",
    author: "PassNexus Team",
    content: `
# Welcome to PassNexus

Setting up your event on PassNexus is designed to be incredibly fast. Here is how you can deploy your first event in less than 5 minutes.

## 1. Create an Event
Once you log into your organizer dashboard, simply click the "Create New Event" button. Fill out the core details: Name, Date, Venue, and an optional description. 

## 2. Customize Pass Settings
You can choose exactly what data appears on the final digital pass. Toggle Name, Designation, Phone, and Company. Want to make it completely on-brand? Simply provide a custom background URL.

## 3. Register Attendees
Copy your public registration link (viewable by clicking the globe icon) and distribute it. Attendees can instantly self-register.

## 4. Scan at the Gate
On the day of the event, click the green camera icon on your dashboard. Use any laptop webcam or mobile browser to rapid-scan the QR codes directly from attendee screens. The scanner turns green for valid passes!
    `
  },
  {
    title: "How to Make Digital Passes Like the Pros",
    slug: "how-to-make-digital-passes",
    excerpt: "Stop using paper tickets. Learn the best practices for designing and deploying fast, accessible, and secure QR code passes for conferences.",
    date: "2026-04-12",
    author: "PassNexus Tech",
    content: `
# The Digital Pass Revolution

Gone are the days of printing thousands of physical badges. Digital QR passes are cheaper, faster, and far more environmentally friendly.

## The Secret to a Perfect Pass
1. **High Contrast:** Ensure your background image is dark enough or light enough so the white QR code stands out sharply for scanners.
2. **Key Information:** Don't crowd the pass. Name, Company, and Ticket Tier (VIP/Visitor) is usually all the gate staff needs to see.
3. **Downloadability:** Attendees lose emails. PassNexus provides a native "Save to PDF" and a portal to recover a lost pass using just their registered email.

By utilizing the robust PassNexus scaling architecture, your users get high-quality web passes without downloading dedicated mobile apps.
    `
  }
];
