import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  MapPin,
  Users,
  Code,
  Palette,
  Heart,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const events = [
  {
    id: 1,
    title: 'CodeFest 2024',
    description: '24-hour hackathon with amazing prizes. Build, innovate, and win!',
    date: 'Jan 15, 2025',
    location: 'Main Auditorium',
    type: 'Technical',
    icon: Code,
    color: 'primary',
    attendees: 156,
  },
  {
    id: 2,
    title: 'AI/ML Workshop',
    description: 'Hands-on workshop on machine learning fundamentals and applications.',
    date: 'Jan 20, 2025',
    location: 'Lab 301',
    type: 'Technical',
    icon: Code,
    color: 'primary',
    attendees: 89,
  },
  {
    id: 3,
    title: 'Cultural Night',
    description: 'Annual cultural fest featuring music, dance, and drama performances.',
    date: 'Jan 25, 2025',
    location: 'Open Air Theatre',
    type: 'Cultural',
    icon: Palette,
    color: 'accent',
    attendees: 324,
  },
  {
    id: 4,
    title: 'Blood Donation Camp',
    description: 'Give the gift of life. Every donation counts!',
    date: 'Feb 1, 2025',
    location: 'Health Center',
    type: 'Social',
    icon: Heart,
    color: 'destructive',
    attendees: 78,
  },
  {
    id: 5,
    title: 'Tech Talk: Future of Web',
    description: 'Industry experts discuss emerging web technologies and trends.',
    date: 'Feb 5, 2025',
    location: 'Seminar Hall',
    type: 'Technical',
    icon: Sparkles,
    color: 'primary',
    attendees: 112,
  },
  {
    id: 6,
    title: 'Tree Plantation Drive',
    description: 'Join us in making our campus greener. Tools and saplings provided.',
    date: 'Feb 10, 2025',
    location: 'Campus Ground',
    type: 'Social',
    icon: Heart,
    color: 'success',
    attendees: 65,
  },
];

const typeColors = {
  Technical: 'bg-primary/10 text-primary border-primary/20',
  Cultural: 'bg-accent/10 text-accent border-accent/20',
  Social: 'bg-success/10 text-success border-success/20',
};

const cardColors = {
  primary: {
    border: 'border-primary/20 hover:border-primary/40',
    iconBg: 'bg-primary/10 text-primary',
  },
  accent: {
    border: 'border-accent/20 hover:border-accent/40',
    iconBg: 'bg-accent/10 text-accent',
  },
  success: {
    border: 'border-success/20 hover:border-success/40',
    iconBg: 'bg-success/10 text-success',
  },
  destructive: {
    border: 'border-destructive/20 hover:border-destructive/40',
    iconBg: 'bg-destructive/10 text-destructive',
  },
};

export default function Events() {
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const { toast } = useToast();

  const handleRegister = (eventId: number, title: string) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter((id) => id !== eventId));
      toast({
        title: 'Registration Cancelled',
        description: `You've unregistered from "${title}".`,
      });
    } else {
      setRegisteredEvents([...registeredEvents, eventId]);
      toast({
        title: 'Registered! 🎉',
        description: `You're now registered for "${title}".`,
      });
    }
  };

  const [filter, setFilter] = useState<'All' | 'Technical' | 'Cultural' | 'Social'>('All');

  const filteredEvents =
    filter === 'All' ? events : events.filter((e) => e.type === filter);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Events & Volunteering</h1>
          <p className="text-muted-foreground">
            Discover exciting events and volunteer opportunities on campus.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6 animate-slide-up">
          {(['All', 'Technical', 'Cultural', 'Social'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                filter === type
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event, index) => {
            const Icon = event.icon;
            const colors = cardColors[event.color as keyof typeof cardColors];
            const isRegistered = registeredEvents.includes(event.id);

            return (
              <div
                key={event.id}
                className="animate-slide-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div
                  className={cn(
                    'card-elevated p-6 h-full flex flex-col transition-all duration-300',
                    colors.border
                  )}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={cn('p-3 rounded-xl', colors.iconBg)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {event.title}
                        </h3>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium border',
                            typeColors[event.type as keyof typeof typeColors]
                          )}
                        >
                          {event.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} interested</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border">
                    <Button
                      onClick={() => handleRegister(event.id, event.title)}
                      variant={isRegistered ? 'default' : 'outline'}
                      className={cn(
                        'w-full',
                        isRegistered
                          ? 'bg-success hover:bg-success/90 text-success-foreground'
                          : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                      )}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Registered
                        </>
                      ) : (
                        'Register Interest'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
