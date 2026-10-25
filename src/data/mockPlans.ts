import type { EventPlan, EventCategory } from '../types/event';

export const MOCK_EVENT_PLANS: Record<EventCategory, EventPlan> = {
  wedding: {
    id: 'plan-wedding-01',
    title: 'Elena & Julian’s Botanical Glasshouse Wedding',
    category: 'wedding',
    guestCount: 120,
    targetDate: '2027-09-18',
    location: 'Conservatory Gardens & Pavilion, Hudson Valley',
    status: 'planning',
    budget: {
      totalBudget: 42000,
      allocatedBudget: 38200,
      contingencyBuffer: 3800,
      currency: '$',
      categories: [
        { id: 'b1', category: 'Venue & Conservatory Rental', allocatedAmount: 14500, spentAmount: 7000, percentage: 34.5, priority: 'must-have' },
        { id: 'b2', category: 'Catering, Passed Bites & Bar', allocatedAmount: 12800, spentAmount: 3000, percentage: 30.5, priority: 'must-have' },
        { id: 'b3', category: 'Fine Art Photo & Cinematography', allocatedAmount: 4800, spentAmount: 1500, percentage: 11.4, priority: 'must-have' },
        { id: 'b4', category: 'Floral Installations & Lighting', allocatedAmount: 3600, spentAmount: 800, percentage: 8.6, priority: 'recommended' },
        { id: 'b5', category: 'Live Acoustic Duo & DJ Hybrid', allocatedAmount: 2500, spentAmount: 500, percentage: 6.0, priority: 'recommended' },
        { id: 'b6', category: 'Printed Menus, Signage & Favors', allocatedAmount: 1000, spentAmount: 200, percentage: 2.4, priority: 'optional' },
        { id: 'b7', category: 'Smart Contingency Reserve (AI Buffer)', allocatedAmount: 3800, spentAmount: 0, percentage: 9.0, priority: 'must-have', notes: 'Reserved for weather tenting or late guest additions' }
      ]
    },
    timeline: [
      { id: 't1', time: '11:00 AM', phase: 'setup', title: 'Vendor Load-In & Floral Rigging', description: 'Florist installs hanging jasmine arches; AV conducts wireless mic soundcheck in pavilion.', assignedRole: 'Lead Coordinator' },
      { id: 't2', time: '02:30 PM', phase: 'arrival', title: 'First Look & Bridal Party Portraits', description: 'Private courtyard photography in natural diffused light before guest arrival.', assignedRole: 'Photographer', isMilestone: true },
      { id: 't3', time: '04:00 PM', phase: 'arrival', title: 'Guest Welcome Refreshments', description: 'Elderflower spritz and chilled infused waters served at garden entrance.', assignedRole: 'Hospitality Captain' },
      { id: 't4', time: '04:30 PM', phase: 'main-program', title: 'Ceremony in Glasshouse', description: 'String quartet plays acoustic arrangements; unplugged ceremony with vows.', assignedRole: 'Officiant & Officiant Assistant', isMilestone: true },
      { id: 't5', time: '05:15 PM', phase: 'refreshment', title: 'Sunset Cocktails & Passed Canapés', description: 'Live Spanish guitar on the terrace; couple sneaks away for golden hour mini-session.', assignedRole: 'Catering Lead' },
      { id: 't6', time: '06:45 PM', phase: 'main-program', title: 'Grand Entrance & Three-Course Dinner', description: 'Family toasts between course 1 and 2; speech timer discreetly signaled.', assignedRole: 'Master of Ceremonies' },
      { id: 't7', time: '09:00 PM', phase: 'main-program', title: 'First Dance & Dance Floor Opening', description: 'Low fog effect, transition to high-energy funk and neo-soul playlist.', assignedRole: 'DJ / Band Leader', isMilestone: true },
      { id: 't8', time: '11:30 PM', phase: 'farewell', title: 'Sparkler Pathway & Vintage Getaway Car', description: 'Guests line the stone path; couple departs in 1968 Alfa Romeo.', assignedRole: 'Logistics Coordinator' }
    ],
    vendorChecklist: [
      { id: 'v1', category: 'venue', task: 'Finalize Floor Plan & Fire Marshal Seating Limits', dueDateOffsetDays: -90, dueDateLabel: '3 Months Prior', status: 'booked', estimatedCostRange: '$12,000 - $15,000', aiTip: 'Ensure 36-inch clearance between guest table chairs for banquet servers.' },
      { id: 'v2', category: 'catering', task: 'Tasting Session & Finalize Dietary Substitutions', dueDateOffsetDays: -60, dueDateLabel: '2 Months Prior', status: 'in-progress', estimatedCostRange: '$10,000 - $13,500', aiTip: 'Include 4 extra hot vendor meals for photo, video, and audio teams.' },
      { id: 'v3', category: 'photography', task: 'Compile "Must-Have" Family Grouping Shot List', dueDateOffsetDays: -30, dueDateLabel: '1 Month Prior', status: 'in-progress', estimatedCostRange: '$4,500 - $5,500', aiTip: 'Limit formal groupings to 12 combinations to preserve cocktail hour enjoyment.' },
      { id: 'v4', category: 'entertainment', task: 'Submit "Do-Not-Play" and Entrance Track Cues', dueDateOffsetDays: -14, dueDateLabel: '2 Weeks Prior', status: 'pending', estimatedCostRange: '$2,000 - $3,000', aiTip: 'Test wireless transmitter range between courtyard and indoor hall.' }
    ],
    ideas: [
      { id: 'i1', title: 'Audio Guestbook Rotary Phone', themeTag: 'Vintage Tech', description: 'A retro 1970s telephone booth where friends record heartfelt audio messages after cocktails.', budgetImpact: 'low', practicalityScore: 9 },
      { id: 'i2', title: 'Midnight Truffle & Warm Pretzel Station', themeTag: 'Late Night Fuel', description: 'Surprise the late-night dance floor with mini artisanal street pretzels and dipping cheeses.', budgetImpact: 'medium', practicalityScore: 10 },
      { id: 'i3', title: 'Personalized Botanical Wax-Sealed Place Cards', themeTag: 'Intimate Keepsake', description: 'Hand-pressed dried wild thyme sealed with rosemary green wax atop each linen napkin.', budgetImpact: 'low', practicalityScore: 8 }
    ],
    forgettingAnalysis: {
      criticalGaps: [
        'Vendor meal guarantee count for DJ and photography assistant (must confirm 10 days prior).',
        'Rain backup ceremony setup decision deadline (must notify venue 48h in advance).'
      ],
      complianceReminders: [
        'Local noise decibel drop after 10:30 PM in Hudson Valley township.',
        'Venue COI (Certificate of Insurance) naming both property owner and catering company.'
      ],
      readinessScore: 88
    }
  },

  birthday: {
    id: 'plan-birthday-01',
    title: 'Marcus’s Sunset Neo-Tokyo 30th Birthday',
    category: 'birthday',
    guestCount: 45,
    targetDate: '2026-11-14',
    location: 'Skyline Penthouse Loft & Terrace, Downtown',
    status: 'planning',
    budget: {
      totalBudget: 8500,
      allocatedBudget: 7800,
      contingencyBuffer: 700,
      currency: '$',
      categories: [
        { id: 'bb1', category: 'Loft Rental & Terrace Access', allocatedAmount: 3200, spentAmount: 1600, percentage: 37.6, priority: 'must-have' },
        { id: 'bb2', category: 'Signature Mixologist & Crafted Bar', allocatedAmount: 2400, spentAmount: 800, percentage: 28.2, priority: 'must-have' },
        { id: 'bb3', category: 'Japanese Street Food Tapas (Yakitori/Bao)', allocatedAmount: 1500, spentAmount: 500, percentage: 17.6, priority: 'recommended' },
        { id: 'bb4', category: 'Cyberpunk Neon Accents & Photo Booth', allocatedAmount: 700, spentAmount: 300, percentage: 8.2, priority: 'recommended' },
        { id: 'bb5', category: 'Smart Buffer (Emergency Bar Restock / Cleaning)', allocatedAmount: 700, spentAmount: 0, percentage: 8.2, priority: 'must-have' }
      ]
    },
    timeline: [
      { id: 'bt1', time: '05:30 PM', phase: 'setup', title: 'Soundcheck & Ambient Light Calibration', description: 'Lo-fi chill beats playing, neon signs powered, dry ice cocktail test.', assignedRole: 'Host & Bartender' },
      { id: 'bt2', time: '07:00 PM', phase: 'arrival', title: 'Welcome Drinks & Rooftop Golden Hour', description: 'Guests arrive to Yuzu Gin spritzes and skyline photo ops.', assignedRole: 'Host' },
      { id: 'bt3', time: '08:30 PM', phase: 'refreshment', title: 'Interactive Yakitori & Bao Bar Opens', description: 'Freshly grilled skewers and warm bao served family-style on terrace.', assignedRole: 'Catering Captain' },
      { id: 'bt4', time: '09:45 PM', phase: 'main-program', title: 'Surprise Video Roast & Toast', description: 'Short 4-minute curated video reel of childhood stories on projector.', assignedRole: 'Best Friend', isMilestone: true },
      { id: 'bt5', time: '10:15 PM', phase: 'main-program', title: 'Matcha Fondant Cake & Sparklers', description: 'Birthday toast with glowing sparklers overlooking the city lights.', assignedRole: 'Mixologist', isMilestone: true },
      { id: 'bt6', time: '12:30 AM', phase: 'farewell', title: 'Rideshare Queue & Event Winddown', description: 'Bottled electrolytes & bao snacks distributed for the trip home.', assignedRole: 'Host' }
    ],
    vendorChecklist: [
      { id: 'bv1', category: 'venue', task: 'Confirm Freight Elevator Access Hours for Bartender', dueDateOffsetDays: -14, dueDateLabel: '2 Weeks Prior', status: 'booked', estimatedCostRange: '$3,000 - $3,500' },
      { id: 'bv2', category: 'catering', task: 'Finalize Spirit Inventory & Ice Block Quantities', dueDateOffsetDays: -7, dueDateLabel: '1 Week Prior', status: 'in-progress', estimatedCostRange: '$2,000 - $2,500', aiTip: 'Order 1.5 lbs of cocktail ice per guest for high-volume mixing.' },
      { id: 'bv3', category: 'entertainment', task: 'Curate 5-Hour Progressive Spotify / Soundcloud Tracklist', dueDateOffsetDays: -3, dueDateLabel: '3 Days Prior', status: 'booked', estimatedCostRange: 'Self-curated' }
    ],
    ideas: [
      { id: 'bi1', title: 'Custom Printed Cocktail Ice Spheres', themeTag: 'Mixology', description: 'Clear stamped ice balls embossed with the number "30" in Japanese Kanji.', budgetImpact: 'low', practicalityScore: 9 },
      { id: 'bi2', title: 'Disposable Film Camera Exchange', themeTag: 'Analog Memories', description: 'Each lounge table gets a retro disposable camera with a challenge card (e.g. funniest laugh).', budgetImpact: 'low', practicalityScore: 10 }
    ],
    forgettingAnalysis: {
      criticalGaps: [
        'Building freight elevator closes at 6:00 PM on Saturdays; bar ice delivery must arrive earlier.',
        'Audio volume ordinance strictly at 11:00 PM for open balcony.'
      ],
      complianceReminders: ['Elevator key deposit required by loft building management.'],
      readinessScore: 92
    }
  },

  community: {
    id: 'plan-community-01',
    title: 'GreenRoots Urban Harvest Festival & Maker Fair',
    category: 'community',
    guestCount: 650,
    targetDate: '2026-10-10',
    location: 'Riverside Community Park & Greenway',
    status: 'planning',
    budget: {
      totalBudget: 18500,
      allocatedBudget: 16800,
      contingencyBuffer: 1700,
      currency: '$',
      categories: [
        { id: 'cb1', category: 'City Permits, Sound Licensure & EMS Standby', allocatedAmount: 3800, spentAmount: 3800, percentage: 20.5, priority: 'must-have' },
        { id: 'cb2', category: 'Canopy Tents, Stage & Audio Rig', allocatedAmount: 6200, spentAmount: 3000, percentage: 33.5, priority: 'must-have' },
        { id: 'cb3', category: 'Porta-Sanitation & Recycling Stations', allocatedAmount: 2200, spentAmount: 1100, percentage: 11.9, priority: 'must-have' },
        { id: 'cb4', category: 'Signage, Wayfinding & Volunteer Shirts', allocatedAmount: 1600, spentAmount: 600, percentage: 8.6, priority: 'recommended' },
        { id: 'cb5', category: 'Local Musician Honorariums & Workshop Kits', allocatedAmount: 3000, spentAmount: 1500, percentage: 16.2, priority: 'recommended' },
        { id: 'cb6', category: 'Contingency & Weather Buffer', allocatedAmount: 1700, spentAmount: 0, percentage: 9.2, priority: 'must-have' }
      ]
    },
    timeline: [
      { id: 'ct1', time: '06:30 AM', phase: 'setup', title: 'Park Gates Open & Vendor Load-In', description: '42 local artisan and farmer canopies staged in color-coded sectors.', assignedRole: 'Logistics Director' },
      { id: 'ct2', time: '09:30 AM', phase: 'setup', title: 'Volunteer Morning Huddle & Radio Check', description: 'Shift briefing, safety protocols, and emergency medical station review.', assignedRole: 'Volunteer Coordinator', isMilestone: true },
      { id: 'ct3', time: '10:00 AM', phase: 'arrival', title: 'Festival Kickoff & Family Workshops', description: 'Seed-bomb making, beekeeping demonstration, acoustic folk stage begins.', assignedRole: 'Program Manager' },
      { id: 'ct4', time: '01:00 PM', phase: 'main-program', title: 'Civic Innovation Awards & Mayor Address', description: 'Short keynote acknowledging local volunteer champions and sponsors.', assignedRole: 'Master of Ceremonies', isMilestone: true },
      { id: 'ct5', time: '04:30 PM', phase: 'farewell', title: 'Community Jam Session & Last Calls', description: 'Interactive drum circle and final artisan market hour.', assignedRole: 'Stage Lead' },
      { id: 'ct6', time: '05:30 PM', phase: 'teardown', title: 'Leave-No-Trace Breakdown & Sorting', description: 'Compost and recyclable sorting teams sweep the park green.', assignedRole: 'Sanitation Lead', isMilestone: true }
    ],
    vendorChecklist: [
      { id: 'cv1', category: 'logistics', task: 'Submit Parks & Recreation Special Event Permit', dueDateOffsetDays: -90, dueDateLabel: '3 Months Prior', status: 'booked', estimatedCostRange: '$1,200', aiTip: 'Double check required commercial general liability endorsement language.' },
      { id: 'cv2', category: 'logistics', task: 'Reserve 6 Portable Restrooms + 2 ADA Accessible Units', dueDateOffsetDays: -45, dueDateLabel: '6 Weeks Prior', status: 'booked', estimatedCostRange: '$2,200' },
      { id: 'cv3', category: 'logistics', task: 'Dispatch Volunteer Shift Rosters & Safety Protocols', dueDateOffsetDays: -7, dueDateLabel: '1 Week Prior', status: 'in-progress', estimatedCostRange: '$400' }
    ],
    ideas: [
      { id: 'ci1', title: 'Solar-Powered Mobile Charging Haven', themeTag: 'Sustainability', description: 'Partner with local solar co-op to provide free green charging stations while families rest.', budgetImpact: 'low', practicalityScore: 10 },
      { id: 'ci2', title: 'Giant Interactive Chalk Community Mural', themeTag: 'Artistic Engagement', description: 'Grid paper pavement drawing asking: "What makes our neighborhood thrive?"', budgetImpact: 'low', practicalityScore: 9 }
    ],
    forgettingAnalysis: {
      criticalGaps: [
        'Dedicated handicap parking cones and ADA-compliant path to main stage.',
        'Water refill station hookup requires garden hose adapter for park municipal spigot.'
      ],
      complianceReminders: ['Fire extinguisher certification required at all hot food truck stalls.'],
      readinessScore: 91
    }
  },

  custom: {
    id: 'plan-custom-01',
    title: 'Aura Horizons: Autumn AI Product Keynote & VIP Soiree',
    category: 'custom',
    guestCount: 220,
    targetDate: '2026-11-20',
    location: 'The Luminary Atrium & Auditorium, San Francisco',
    status: 'planning',
    budget: {
      totalBudget: 65000,
      allocatedBudget: 58500,
      contingencyBuffer: 6500,
      currency: '$',
      categories: [
        { id: 'k1', category: 'Auditorium & LED Wall AV Production', allocatedAmount: 26000, spentAmount: 13000, percentage: 40.0, priority: 'must-have' },
        { id: 'k2', category: 'Atrium Receptions & Sommelier Pairing', allocatedAmount: 18000, spentAmount: 6000, percentage: 27.7, priority: 'must-have' },
        { id: 'k3', category: 'High-Density Dedicated 10Gb Fiber Uplink', allocatedAmount: 4500, spentAmount: 4500, percentage: 6.9, priority: 'must-have' },
        { id: 'k4', category: 'Branded Interactive Demo Pods & Swag', allocatedAmount: 6000, spentAmount: 2500, percentage: 9.2, priority: 'recommended' },
        { id: 'k5', category: 'Keynote Speaker Honorariums & Concierge', allocatedAmount: 4000, spentAmount: 2000, percentage: 6.2, priority: 'recommended' },
        { id: 'k6', category: 'Smart Buffer (Overtime AV Crew & Security)', allocatedAmount: 6500, spentAmount: 0, percentage: 10.0, priority: 'must-have' }
      ]
    },
    timeline: [
      { id: 'kt1', time: '12:00 PM', phase: 'setup', title: 'Tech Rehearsal & Live Stream Latency Check', description: 'Simulated 4K stream redundancy test to international satellite endpoints.', assignedRole: 'AV Director', isMilestone: true },
      { id: 'kt2', time: '04:00 PM', phase: 'arrival', title: 'VIP Press Check-In & Demo Lounge Preview', description: 'Embargoed press receive hands-on device briefings under NDA.', assignedRole: 'PR Lead' },
      { id: 'kt3', time: '05:30 PM', phase: 'main-program', title: 'Main Keynote Presentation', description: 'Opening 45-minute vision reveal with seamless lighting scene automation.', assignedRole: 'Executive Producer', isMilestone: true },
      { id: 'kt4', time: '06:30 PM', phase: 'refreshment', title: 'Executive Networking & Sommelier Lounge', description: 'Curated wine flight and passed California fusion plates.', assignedRole: 'Hospitality Director' },
      { id: 'kt5', time: '09:00 PM', phase: 'farewell', title: 'Executive Car Service & Swag Dispatch', description: 'Gift bags with bespoke engraved NFC cards given on departure.', assignedRole: 'Concierge' }
    ],
    vendorChecklist: [
      { id: 'kv1', category: 'logistics', task: 'Stress-test 1,000 Concurrent Device Wi-Fi SSID', dueDateOffsetDays: -21, dueDateLabel: '3 Weeks Prior', status: 'booked', estimatedCostRange: '$4,500' },
      { id: 'kv2', category: 'photography', task: 'Contract 3 Camera Live Feed Switcher Operator', dueDateOffsetDays: -30, dueDateLabel: '1 Month Prior', status: 'booked', estimatedCostRange: '$8,000' },
      { id: 'kv3', category: 'entertainment', task: 'Approve Dynamic Motion Graphics & Title Stingers', dueDateOffsetDays: -10, dueDateLabel: '10 Days Prior', status: 'in-progress', estimatedCostRange: '$3,500' }
    ],
    ideas: [
      { id: 'ki1', title: 'Ambient Audio Reactivity Pods', themeTag: 'Sensory Tech', description: 'Glass demo chambers that illuminate and pulse based on speech sentiment during testing.', budgetImpact: 'medium', practicalityScore: 9 },
      { id: 'ki2', title: 'Zero-Waste Digital NFC Smart Badges', themeTag: 'Eco Innovation', description: 'Replace paper badges with re-programmable bamboo wooden cards with contact exchange.', budgetImpact: 'low', practicalityScore: 10 }
    ],
    forgettingAnalysis: {
      criticalGaps: [
        'Dedicated power breaker isolated strictly for keynote audio console to prevent surge trips.',
        'Dual battery backup for live teleprompter display.'
      ],
      complianceReminders: ['Fire capacity maximum 250 in the secondary Atrium space.'],
      readinessScore: 94
    }
  }
};
