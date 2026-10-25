import React from 'react';
import { 
  Heart, 
  Cake, 
  Users, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Clock,
  PieChart
} from 'lucide-react';
import { EVENT_TYPES } from '../../data/eventTypes';
import type { EventCategory, EventTypeDefinition } from '../../types/event';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Container } from '../common/Container';

interface EventTypesSectionProps {
  onSelectCategory: (category: EventCategory) => void;
  onPreviewPlan: (category: EventCategory) => void;
}

export const EventTypesSection: React.FC<EventTypesSectionProps> = ({
  onSelectCategory,
  onPreviewPlan,
}) => {
  const getIcon = (id: EventCategory) => {
    switch (id) {
      case 'wedding':
        return <Heart className="w-5 h-5 text-rose-400" />;
      case 'birthday':
        return <Cake className="w-5 h-5 text-amber-400" />;
      case 'community':
        return <Users className="w-5 h-5 text-emerald-400" />;
      case 'custom':
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  const getBadgeVariant = (id: EventCategory): 'rose' | 'amber' | 'emerald' | 'purple' => {
    switch (id) {
      case 'wedding':
        return 'rose';
      case 'birthday':
        return 'amber';
      case 'community':
        return 'emerald';
      case 'custom':
      default:
        return 'purple';
    }
  };

  return (
    <section id="event-types" className="py-20 sm:py-28 relative">
      <Container size="wide">
        <SectionHeading
          badgeText="Versatile Architecture"
          badgeVariant="rose"
          title="Tailored blueprints for"
          gradientWord="every milestone"
          description="Whether you are orchestrating a 200-guest wedding or an intimate rooftop 30th birthday, Veyra adapts to the unique rhythm, vendors, and compliance demands of your event."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {EVENT_TYPES.map((type: EventTypeDefinition) => (
            <Card
              key={type.id}
              variant="glass"
              isHoverable
              padding="lg"
              className="flex flex-col justify-between group border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div>
                {/* Top header & badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {getIcon(type.id)}
                  </div>
                  <Badge variant={getBadgeVariant(type.id)} size="sm">
                    {type.badge}
                  </Badge>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors">
                  {type.name}
                </h3>
                <p className="text-xs text-rose-400/90 font-medium mt-1">
                  {type.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-400 mt-3.5 leading-relaxed">
                  {type.description}
                </p>

                {/* Preparation window */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-slate-300 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{type.typicalTimeline}</span>
                </div>

                {/* Highlights List */}
                <div className="mt-5 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                    Veyra Automations:
                  </span>
                  <ul className="space-y-1.5">
                    {type.keyHighlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400/90 shrink-0 mt-0.5" />
                        <span className="leading-tight">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Budget Focus Pill */}
                <div className="mt-5 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-300 flex items-start gap-2">
                  <PieChart className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Budget Focus:</span>
                    <span className="text-slate-400">{type.recommendedBudgetFocus}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-7 pt-4 border-t border-white/10 flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onSelectCategory(type.id)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="w-full justify-center"
                >
                  Plan {type.name}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPreviewPlan(type.id)}
                  className="w-full justify-center text-xs text-slate-400 hover:text-white"
                >
                  Inspect Template Blueprint
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
