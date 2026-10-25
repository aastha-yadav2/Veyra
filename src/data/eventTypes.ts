import type { EventTypeDefinition } from '../types/event';

export const EVENT_TYPES: EventTypeDefinition[] = [
  {
    id: 'wedding',
    name: 'Wedding',
    tagline: 'Timeless ceremonies without spreadsheet fatigue',
    description: 'Harmonize vows, cocktail hour transitions, banquet seating, floral deliverables, and contingency weather plans with intelligent pacing.',
    typicalTimeline: '8–14 months preparation • Full-day orchestration',
    keyHighlights: [
      'Smart 12-category budget with 10% surprise buffer',
      'Ceremony-to-reception minute-by-minute rundown',
      'Tasting, fitting, and rehearsal vendor deadlines',
      'Guest dietary matrix & seating layout harmony'
    ],
    recommendedBudgetFocus: 'Venue & Dining (45%) • Photo/Video (15%) • Decor (15%)',
    badge: 'Most Popular',
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    accentColor: '#f43f5e'
  },
  {
    id: 'birthday',
    name: 'Birthday',
    tagline: 'Milestone celebrations engineered for joy',
    description: 'From intimate 30th rooftop dinner parties to lively sweet 16s and golden jubilations. Curate themes, DJs, caterers, and surprise reveals with ease.',
    typicalTimeline: '3–8 weeks preparation • Evening or weekend afternoon',
    keyHighlights: [
      'Theme & atmosphere concept generator',
      'Entertainment and audio/visual countdown cue sheet',
      'Cake delivery & catering staging schedule',
      'RSVP & gift registry consolidation'
    ],
    recommendedBudgetFocus: 'Experience & Bar (40%) • Sound/Music (25%) • Favors & Cake (15%)',
    badge: 'Milestone Ready',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    accentColor: '#f59e0b'
  },
  {
    id: 'community',
    name: 'Community Event',
    tagline: 'Impactful gatherings that unite people seamlessly',
    description: 'Coordinate multi-stakeholder town halls, charity 5Ks, seasonal block parties, or cultural festivals with clear volunteer duty assignments.',
    typicalTimeline: '2–6 months preparation • Multi-hour or multi-day',
    keyHighlights: [
      'Permits, sound compliance, and municipal checklists',
      'Volunteer shift matrices and emergency contact trees',
      'Sponsor acknowledgment schedule and banner placement',
      'Crowd flow, accessibility, and sanitation management'
    ],
    recommendedBudgetFocus: 'Permits & Security (25%) • Facilities & Stages (35%) • Refreshments (25%)',
    badge: 'Civic & Non-Profit',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    accentColor: '#10b981'
  },
  {
    id: 'custom',
    name: 'Custom Event',
    tagline: 'Any bespoke experience you envision',
    description: 'Executive retreats, brand product launches, film screenings, pop-up dinner clubs, and gallery openings with completely tailored milestones.',
    typicalTimeline: 'Configurable • Adaptive staging',
    keyHighlights: [
      'Custom milestone creation & goal KPIs',
      'Multi-vendor bidding & contract milestone track',
      'VIP protocol and press release timeline integration',
      'Comprehensive "What am I forgetting?" risk audit'
    ],
    recommendedBudgetFocus: 'Custom dynamic breakdown based on your defined objectives',
    badge: 'Bespoke AI',
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    accentColor: '#a855f7'
  }
];
