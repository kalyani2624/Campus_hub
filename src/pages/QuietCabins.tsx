import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useBookingStore, TimeSlot } from '@/stores/bookingStore';
import { useToast } from '@/hooks/use-toast';
import { DoorOpen, CheckCircle, Lock, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const cabins = [
  { id: 1, name: 'Cabin 1', description: 'Quiet corner with natural light' },
  { id: 2, name: 'Cabin 2', description: 'Spacious room with whiteboard' },
  { id: 3, name: 'Cabin 3', description: 'Premium cabin with monitor' },
];

const timeSlots: { id: TimeSlot; label: string; time: string }[] = [
  { id: 'morning', label: 'Morning', time: '9 AM – 12 PM' },
  { id: 'afternoon', label: 'Afternoon', time: '12 PM – 4 PM' },
  { id: 'evening', label: 'Evening', time: '4 PM – 8 PM' },
];

export default function QuietCabins() {
  const [selectedCabin, setSelectedCabin] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>('morning');
  const { user } = useAuthStore();
  const { isCabinAvailable, bookCabin } = useBookingStore();
  const { toast } = useToast();

  const today = format(new Date(), 'yyyy-MM-dd');

  const handleBookCabin = () => {
    if (!user || selectedCabin === null) return;

    const success = bookCabin(selectedCabin, user.id, selectedSlot, today);
    if (success) {
      toast({
        title: 'Cabin Booked! 🎉',
        description: `${cabins.find((c) => c.id === selectedCabin)?.name} is yours for ${
          timeSlots.find((s) => s.id === selectedSlot)?.time
        }.`,
      });
      setSelectedCabin(null);
    } else {
      toast({
        title: 'Booking Failed',
        description: 'This cabin is already booked for the selected time.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-accent">Premium Spaces</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quiet Study Cabins</h1>
          <p className="text-muted-foreground">
            Private, distraction-free spaces for focused study sessions.
          </p>
        </div>

        {/* Time Slot Selection */}
        <div className="flex flex-wrap gap-3 mb-6 animate-slide-up">
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot.id)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                selectedSlot === slot.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {slot.label}
            </button>
          ))}
        </div>

        {/* Cabins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {cabins.map((cabin, index) => {
            const available = isCabinAvailable(cabin.id, selectedSlot, today);
            const isSelected = selectedCabin === cabin.id;

            return (
              <div
                key={cabin.id}
                className="animate-slide-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <button
                  onClick={() => available && setSelectedCabin(cabin.id)}
                  disabled={!available}
                  className={cn(
                    'w-full text-left p-6 rounded-xl border-2 transition-all duration-300',
                    available
                      ? isSelected
                        ? 'border-accent bg-accent/5 shadow-lg'
                        : 'border-border bg-card hover:border-accent/50 hover:shadow-md'
                      : 'border-border bg-muted/30 opacity-60 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={cn(
                        'p-3 rounded-xl',
                        available ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <DoorOpen className="w-6 h-6" />
                    </div>
                    {available ? (
                      isSelected ? (
                        <CheckCircle className="w-6 h-6 text-accent" />
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                          Available
                        </span>
                      )
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive">
                        <Lock className="w-3 h-3" />
                        <span className="text-xs font-medium">Booked</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">{cabin.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{cabin.description}</p>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      {timeSlots.find((s) => s.id === selectedSlot)?.time}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Book Button */}
        {selectedCabin !== null && (
          <div className="animate-scale-in">
            <Button onClick={handleBookCabin} className="w-full sm:w-auto btn-gradient">
              Book {cabins.find((c) => c.id === selectedCabin)?.name}
            </Button>
          </div>
        )}

        {/* Info Card */}
        <div
          className="card-elevated p-6 mt-8 animate-slide-up"
          style={{ animationDelay: '0.5s' }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-3">About Quiet Cabins</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Soundproof rooms for distraction-free study
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Air-conditioned with comfortable seating
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Power outlets and USB charging
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Free Wi-Fi access
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
