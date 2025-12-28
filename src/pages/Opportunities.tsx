import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Briefcase,
  Clock,
  Award,
  DollarSign,
  Coffee,
  BookOpen,
  Users,
  HeartHandshake,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const opportunities = [
  {
    id: 1,
    title: 'Canteen Billing Assistant',
    description: 'Help manage the billing counter during peak hours. Great for learning customer service skills.',
    duration: '2-3 hours/day',
    benefits: ['Monthly Stipend', 'Free Meals', 'Experience Certificate'],
    icon: Coffee,
    color: 'primary',
  },
  {
    id: 2,
    title: 'Library Helper',
    description: 'Assist in organizing books, helping students, and maintaining the library system.',
    duration: 'Flexible Hours',
    benefits: ['Stipend', 'Priority Cabin Access', 'Certificate'],
    icon: BookOpen,
    color: 'accent',
  },
  {
    id: 3,
    title: 'Event Volunteer',
    description: 'Support college events like fests, seminars, and workshops. Build your network!',
    duration: 'Event-based',
    benefits: ['Participation Certificate', 'Networking', 'Free Entry'],
    icon: Users,
    color: 'success',
  },
  {
    id: 4,
    title: 'Hackathon Support Team',
    description: 'Help organize coding competitions and hackathons. Perfect for tech enthusiasts.',
    duration: 'Project-based',
    benefits: ['Certificate', 'Mentorship', 'Tech Swag'],
    icon: Briefcase,
    color: 'warning',
  },
  {
    id: 5,
    title: 'Social Service Worker',
    description: 'Participate in community outreach programs and make a positive impact.',
    duration: '4-6 hours/week',
    benefits: ['Participation Certificate', 'Community Service Hours', 'Experience'],
    icon: HeartHandshake,
    color: 'primary',
  },
];

const colorVariants = {
  primary: {
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    icon: 'bg-primary/10 text-primary',
  },
  accent: {
    bg: 'bg-accent/5',
    border: 'border-accent/20',
    icon: 'bg-accent/10 text-accent',
  },
  success: {
    bg: 'bg-success/5',
    border: 'border-success/20',
    icon: 'bg-success/10 text-success',
  },
  warning: {
    bg: 'bg-warning/5',
    border: 'border-warning/20',
    icon: 'bg-warning/10 text-warning',
  },
};

export default function Opportunities() {
  const { toast } = useToast();

  const handleApply = (title: string) => {
    toast({
      title: 'Application Submitted! 🎉',
      description: `Your interest in "${title}" has been registered. You'll hear back soon.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Part-Time Opportunities</h1>
          <p className="text-muted-foreground">
            Explore student-friendly roles to gain experience and earn while you learn.
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="space-y-4">
          {opportunities.map((opp, index) => {
            const variant = colorVariants[opp.color as keyof typeof colorVariants];
            const Icon = opp.icon;

            return (
              <div
                key={opp.id}
                className="animate-slide-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div
                  className={cn(
                    'card-elevated p-6 transition-all duration-300 hover:shadow-lg',
                    variant.bg,
                    variant.border
                  )}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Icon & Title */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={cn('p-3 rounded-xl', variant.icon)}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {opp.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {opp.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {opp.benefits.map((benefit) => (
                            <span
                              key={benefit}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-card border border-border text-foreground"
                            >
                              {benefit.includes('Certificate') ? (
                                <Award className="w-3 h-3" />
                              ) : benefit.includes('Stipend') ? (
                                <DollarSign className="w-3 h-3" />
                              ) : null}
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Duration & Action */}
                    <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{opp.duration}</span>
                      </div>
                      <Button
                        onClick={() => handleApply(opp.title)}
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Note */}
        <div
          className="card-elevated p-6 mt-8 animate-slide-up"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-accent/10 text-accent">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                All volunteer roles include certificates!
              </h3>
              <p className="text-sm text-muted-foreground">
                Participation certificates are provided for all event volunteer roles.
                These are great additions to your resume and can help with future opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
