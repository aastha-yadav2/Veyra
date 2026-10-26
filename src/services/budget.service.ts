/**
 * Veyra Pure Domain Budget Service
 * Handles deterministic budget allocations, weights, and safety reserve calculations.
 */

import type { EventCategory, BudgetSummary, BudgetItem } from '../types/event';

export class BudgetService {
  /**
   * Pure domain calculation for smart budget allocation with 10% AI safety buffer.
   */
  public calculateSmartBudget(category: EventCategory, totalAmount: number): BudgetSummary {
    const contingencyRate = 0.10; // 10% smart emergency reserve
    const buffer = Math.round(totalAmount * contingencyRate);
    const usableBudget = totalAmount - buffer;

    let weights: { category: string; pct: number; priority: 'must-have' | 'recommended' | 'optional' }[];

    switch (category) {
      case 'wedding':
        weights = [
          { category: 'Venue & Reception Dining', pct: 0.45, priority: 'must-have' },
          { category: 'Photography & Cinematography', pct: 0.16, priority: 'must-have' },
          { category: 'Floral & Atmosphere Design', pct: 0.14, priority: 'recommended' },
          { category: 'Live Music & Entertainment', pct: 0.12, priority: 'recommended' },
          { category: 'Stationery, Favors & Signage', pct: 0.05, priority: 'optional' },
          { category: 'Attire & Beauty Prep', pct: 0.08, priority: 'recommended' },
        ];
        break;
      case 'birthday':
        weights = [
          { category: 'Private Venue or Lounge', pct: 0.35, priority: 'must-have' },
          { category: 'Mixology & Culinary Bites', pct: 0.32, priority: 'must-have' },
          { category: 'DJ & Sound Experience', pct: 0.18, priority: 'recommended' },
          { category: 'Theme Lighting & Photo Ops', pct: 0.10, priority: 'recommended' },
          { category: 'Custom Cake & Midnight Treats', pct: 0.05, priority: 'recommended' },
        ];
        break;
      case 'community':
        weights = [
          { category: 'City Permits, Sound & Security', pct: 0.25, priority: 'must-have' },
          { category: 'Canopy Staging & Audio Rig', pct: 0.35, priority: 'must-have' },
          { category: 'Restrooms & Eco-Recycling', pct: 0.15, priority: 'must-have' },
          { category: 'Performer Honorariums', pct: 0.15, priority: 'recommended' },
          { category: 'Signage & Volunteer Kits', pct: 0.10, priority: 'optional' },
        ];
        break;
      case 'custom':
      default:
        weights = [
          { category: 'Main Space & Production AV', pct: 0.40, priority: 'must-have' },
          { category: 'Hospitality & Beverage Service', pct: 0.28, priority: 'must-have' },
          { category: 'Guest Experiential Activations', pct: 0.16, priority: 'recommended' },
          { category: 'Brand Assets & Collateral', pct: 0.08, priority: 'recommended' },
          { category: 'Staffing & Concierge', pct: 0.08, priority: 'recommended' },
        ];
        break;
    }

    const categories: BudgetItem[] = weights.map((w, idx): BudgetItem => {
      const allocated = Math.round(usableBudget * w.pct);
      return {
        id: `calc-b-${idx + 1}`,
        category: w.category,
        allocatedAmount: allocated,
        spentAmount: 0,
        percentage: Math.round(w.pct * 90), // 90% usable + 10% buffer
        priority: w.priority,
      };
    });

    // Add explicit contingency buffer item
    categories.push({
      id: 'calc-b-buffer',
      category: 'Smart Contingency Reserve (AI Buffer)',
      allocatedAmount: buffer,
      spentAmount: 0,
      percentage: 10,
      priority: 'must-have',
      notes: 'Automatic 10% safety margin for unexpected overtime or weather changes.',
    });

    return {
      totalBudget: totalAmount,
      allocatedBudget: totalAmount - buffer,
      contingencyBuffer: buffer,
      currency: '$',
      categories,
    };
  }
}

export const budgetService = new BudgetService();
