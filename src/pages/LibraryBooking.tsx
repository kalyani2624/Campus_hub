import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useBookingStore, TimeSlot } from '@/stores/bookingStore';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Users, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const timeSlots: { id: TimeSlot; label: string; time: string }[] = [
  { id: 'morning', label: 'Morning', time: '9 AM – 12 PM' },
  { id: 'afternoon', label: 'Afternoon', time: '12 PM – 4 PM' },
  { id: 'evening', label: 'Evening', time: '4 PM – 8 PM' },
];

export default function LibraryBooking() {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>('morning');
  const { user } = useAuthStore();
  const { totalSeats, getAvailableSeats, getBookedSeats, bookSeat } = useBookingStore();
  const { toast } = useToast();

  const today = format(new Date(), 'yyyy-MM-dd');
  const available = getAvailableSeats(selectedSlot, today);
  const booked = getBookedSeats(selectedSlot, today);

  const handleBookSeat = () => {
    if (!user) return;

    const success = bookSeat(user.id, selectedSlot, today);
    if (success) {
      toast({
        title: 'Seat Booked! 🎉',
        description: `Your library seat is confirmed for ${
          timeSlots.find((s) => s.id === selectedSlot)?.time
        }.`,
      });
    } else {
      toast({
        title: 'Booking Failed',
        description: 'No seats available for this time slot.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Library Seat Booking</h1>
          <p className="text-muted-foreground">
            Reserve your study spot for today, {format(new Date(), 'MMMM d, yyyy')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <StatCard
              title="Total Seats"
              value={totalSeats}
              icon={BookOpen}
              variant="default"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <StatCard
              title="Booked"
              value={booked}
              icon={Users}
              variant="warning"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <StatCard
              title="Available"
              value={available}
              icon={CheckCircle}
              variant="success"
            />
          </div>
        </div>

        {/* Time Slot Selection */}
        <div className="card-elevated p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Select Time Slot
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {timeSlots.map((slot) => {
              const slotAvailable = getAvailableSeats(slot.id, today);
              const isSelected = selectedSlot === slot.id;
              
              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={cn(
                    'relative p-5 rounded-xl border-2 transition-all duration-200 text-left',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <h3 className="font-semibold text-foreground mb-1">{slot.label}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{slot.time}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-sm font-medium',
                        slotAvailable > 10 ? 'text-success' : slotAvailable > 0 ? 'text-warning' : 'text-destructive'
                      )}
                    >
                      {slotAvailable} available
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            onClick={handleBookSeat}
            disabled={available === 0}
            className="w-full sm:w-auto btn-gradient"
          >
            Book Seat for {timeSlots.find((s) => s.id === selectedSlot)?.label}
          </Button>
        </div>

        {/* Availability Bar */}
        <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-lg font-semibold text-foreground mb-4">Seat Availability</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Occupancy</span>
                <span className="font-medium text-foreground">
                  {Math.round((booked / totalSeats) * 100)}%
                </span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                  style={{ width: `${(booked / totalSeats) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-muted-foreground">Available ({available})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Booked ({booked})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
