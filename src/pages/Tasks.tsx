import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import { useToast } from '@/hooks/use-toast';
import {
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  Trash2,
  CheckCircle,
  Circle,
  AlertCircle,
} from 'lucide-react';
import { format, isPast, parseISO, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Tasks() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { user } = useAuthStore();
  const { addTask, toggleComplete, deleteTask, getUserTasks } = useTaskStore();
  const { toast } = useToast();

  const tasks = getUserTasks(user?.id || '');
  const today = format(new Date(), 'yyyy-MM-dd');

  const upcomingTasks = tasks
    .filter((t) => !t.completed && t.date >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const overdueTasks = tasks.filter(
    (t) => !t.completed && t.date < today
  );

  const completedTasks = tasks.filter((t) => t.completed);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !date || !time) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    addTask({
      userId: user.id,
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      completed: false,
    });

    toast({
      title: 'Task Added! ✓',
      description: 'Your reminder has been saved.',
    });

    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
  };

  const TaskItem = ({ task }: { task: typeof tasks[0] }) => {
    const isOverdue = !task.completed && isPast(parseISO(task.date)) && !isToday(parseISO(task.date));

    return (
      <div
        className={cn(
          'flex items-start gap-4 p-4 rounded-xl border transition-all duration-200',
          task.completed
            ? 'bg-muted/30 border-border opacity-70'
            : isOverdue
            ? 'bg-destructive/5 border-destructive/30'
            : 'bg-card border-border hover:shadow-md'
        )}
      >
        <button
          onClick={() => toggleComplete(task.id)}
          className={cn(
            'mt-1 transition-colors',
            task.completed ? 'text-success' : 'text-muted-foreground hover:text-primary'
          )}
        >
          {task.completed ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                'font-medium',
                task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
              )}
            >
              {task.title}
            </h3>
            {isOverdue && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                <AlertCircle className="w-3 h-3" />
                Overdue
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(parseISO(task.date), 'MMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.time}
            </span>
          </div>
        </div>

        <button
          onClick={() => deleteTask(task.id)}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tasks & Reminders</h1>
          <p className="text-muted-foreground">
            Stay organized with your study schedule and deadlines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Task Form */}
          <div className="lg:col-span-1">
            <div className="card-elevated p-6 animate-slide-up sticky top-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add New Task
              </h2>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Submit assignment"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Add details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-muted/50 resize-none"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-foreground">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-foreground">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full btn-gradient">
                  Add Task
                </Button>
              </form>
            </div>
          </div>

          {/* Task Lists */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overdue Tasks */}
            {overdueTasks.length > 0 && (
              <div className="animate-slide-up">
                <h2 className="text-lg font-semibold text-destructive mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Overdue ({overdueTasks.length})
                </h2>
                <div className="space-y-3">
                  {overdueTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Tasks */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-primary" />
                Upcoming ({upcomingTasks.length})
              </h2>
              {upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No upcoming tasks. Add one to get started!</p>
                </div>
              )}
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-lg font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Completed ({completedTasks.length})
                </h2>
                <div className="space-y-3">
                  {completedTasks.slice(0, 5).map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
