import { useAuthStore } from '@/stores/authStore';
import { useBookingStore } from '@/stores/bookingStore';
import { useTaskStore } from '@/stores/taskStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import {
  BookOpen,
  DoorOpen,
  CheckSquare,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { getUserBookings, getUserCabinBookings } = useBookingStore();
  const { getUserTasks } = useTaskStore();

  const today = format(new Date(), 'yyyy-MM-dd');
  const userBookings = getUserBookings(user?.id || '');
  const userCabinBookings = getUserCabinBookings(user?.id || '');
  const userTasks = getUserTasks(user?.id || '');
  const pendingTasks = userTasks.filter((t) => !t.completed);
  const upcomingTasks = pendingTasks.filter((t) => t.date >= today).slice(0, 3);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Welcome back</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
            Hello, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your campus activities today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <StatCard
              title="Library Bookings"
              value={userBookings.length}
              icon={BookOpen}
              variant="primary"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <StatCard
              title="Cabin Bookings"
              value={userCabinBookings.length}
              icon={DoorOpen}
              variant="success"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <StatCard
              title="Pending Tasks"
              value={pendingTasks.length}
              icon={CheckSquare}
              variant="warning"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <StatCard
              title="Today's Date"
              value={format(new Date(), 'MMM d')}
              icon={Calendar}
              variant="default"
            />
          </div>
        </div>

        {/* Quick Actions & Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/library"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors"
              >
                <BookOpen className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-foreground">Book Seat</span>
              </a>
              <a
                href="/cabins"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors"
              >
                <DoorOpen className="w-6 h-6 text-accent" />
                <span className="text-sm font-medium text-foreground">Book Cabin</span>
              </a>
              <a
                href="/tasks"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-warning/5 border border-warning/20 hover:bg-warning/10 transition-colors"
              >
                <CheckSquare className="w-6 h-6 text-warning" />
                <span className="text-sm font-medium text-foreground">Add Task</span>
              </a>
              <a
                href="/events"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-success/5 border border-success/20 hover:bg-success/10 transition-colors"
              >
                <Calendar className="w-6 h-6 text-success" />
                <span className="text-sm font-medium text-foreground">View Events</span>
              </a>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Tasks</h2>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(task.date), 'MMM d')} at {task.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No upcoming tasks</p>
                <a
                  href="/tasks"
                  className="text-sm text-primary hover:underline mt-1 inline-block"
                >
                  Add your first task →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
