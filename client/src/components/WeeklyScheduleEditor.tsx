import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Loader2, Clock } from "lucide-react";

interface WeeklyScheduleEditorProps {
  artistId: number;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export function WeeklyScheduleEditor({ artistId }: WeeklyScheduleEditorProps) {
  const utils = trpc.useUtils();
  const [newWindow, setNewWindow] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
  });

  // Fetch existing availability windows
  const { data: windows, isLoading } = trpc.availability.getWindows.useQuery();

  // Create window mutation
  const createWindow = trpc.availability.createWindow.useMutation({
    onSuccess: () => {
      utils.availability.getWindows.invalidate();
      setNewWindow({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" });
    },
  });

  // Delete window mutation
  const deleteWindow = trpc.availability.deleteWindow.useMutation({
    onSuccess: () => {
      utils.availability.getWindows.invalidate();
    },
  });

  // Update window mutation
  const updateWindow = trpc.availability.updateWindow.useMutation({
    onSuccess: () => {
      utils.availability.getWindows.invalidate();
    },
  });

  const handleAddWindow = () => {
    createWindow.mutate({
      dayOfWeek: newWindow.dayOfWeek,
      startTime: newWindow.startTime,
      endTime: newWindow.endTime,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  };

  const handleDeleteWindow = (windowId: number) => {
    if (confirm("Are you sure you want to delete this availability window?")) {
      deleteWindow.mutate({ windowId });
    }
  };

  const handleToggleActive = (windowId: number, currentActive: boolean) => {
    updateWindow.mutate({
      windowId,
      isActive: !currentActive,
    });
  };

  // Group windows by day
  const windowsByDay = windows?.reduce((acc, window) => {
    if (!acc[window.dayOfWeek]) {
      acc[window.dayOfWeek] = [];
    }
    acc[window.dayOfWeek].push(window);
    return acc;
  }, {} as Record<number, typeof windows>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Window Form */}
      <Card className="p-4 bg-muted/30">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Availability Window
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="day">Day</Label>
            <select
              id="day"
              value={newWindow.dayOfWeek}
              onChange={(e) => setNewWindow({ ...newWindow, dayOfWeek: parseInt(e.target.value) })}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={newWindow.startTime}
              onChange={(e) => setNewWindow({ ...newWindow, startTime: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="end-time">End Time</Label>
            <Input
              id="end-time"
              type="time"
              value={newWindow.endTime}
              onChange={(e) => setNewWindow({ ...newWindow, endTime: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleAddWindow}
              disabled={createWindow.isPending}
              className="w-full"
            >
              {createWindow.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Existing Windows by Day */}
      <div className="space-y-4">
        {DAYS_OF_WEEK.map((day) => {
          const dayWindows = windowsByDay?.[day.value] || [];
          
          if (dayWindows.length === 0) {
            return (
              <Card key={day.value} className="p-4 bg-muted/10">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-muted-foreground">{day.label}</h4>
                  <span className="text-sm text-muted-foreground">No availability</span>
                </div>
              </Card>
            );
          }

          return (
            <Card key={day.value} className="p-4">
              <h4 className="font-semibold mb-3">{day.label}</h4>
              <div className="space-y-2">
                {dayWindows.map((window) => (
                  <div
                    key={window.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      window.isActive ? "bg-background" : "bg-muted/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {window.startTime} - {window.endTime}
                      </span>
                      {!window.isActive && (
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(window.id, window.isActive)}
                        disabled={updateWindow.isPending}
                      >
                        {window.isActive ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteWindow(window.id)}
                        disabled={deleteWindow.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {(!windows || windows.length === 0) && (
        <Card className="p-8 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Availability Set</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add your first availability window to start accepting bookings.
          </p>
        </Card>
      )}
    </div>
  );
}
