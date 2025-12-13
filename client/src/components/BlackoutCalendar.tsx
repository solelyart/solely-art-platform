import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar, Plus, Trash2, Loader2, X } from "lucide-react";

interface BlackoutCalendarProps {
  artistId: number;
}

export function BlackoutCalendar({ artistId }: BlackoutCalendarProps) {
  const utils = trpc.useUtils();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBlackout, setNewBlackout] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Fetch blackout dates
  const { data: blackouts, isLoading } = trpc.availability.getBlackouts.useQuery();

  // Create blackout mutation
  const createBlackout = trpc.availability.createBlackout.useMutation({
    onSuccess: () => {
      utils.availability.getBlackouts.invalidate();
      setNewBlackout({ startDate: "", endDate: "", reason: "" });
      setShowAddForm(false);
    },
  });

  // Delete blackout mutation
  const deleteBlackout = trpc.availability.deleteBlackout.useMutation({
    onSuccess: () => {
      utils.availability.getBlackouts.invalidate();
    },
  });

  const handleAddBlackout = () => {
    if (!newBlackout.startDate || !newBlackout.endDate) {
      alert("Please select start and end dates");
      return;
    }

    createBlackout.mutate({
      startDate: new Date(newBlackout.startDate),
      endDate: new Date(newBlackout.endDate),
      reason: newBlackout.reason || undefined,
    });
  };

  const handleDeleteBlackout = (blackoutId: number) => {
    if (confirm("Are you sure you want to remove this blackout date?")) {
      deleteBlackout.mutate({ blackoutId });
    }
  };

  // Sort blackouts by start date
  const sortedBlackouts = useMemo(() => {
    if (!blackouts) return [];
    return [...blackouts].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }, [blackouts]);

  // Separate upcoming and past blackouts
  const now = new Date();
  const upcomingBlackouts = sortedBlackouts.filter(b => new Date(b.endDate) >= now);
  const pastBlackouts = sortedBlackouts.filter(b => new Date(b.endDate) < now);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Button */}
      {!showAddForm && (
        <Button onClick={() => setShowAddForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Blackout Date
        </Button>
      )}

      {/* Add Form */}
      {showAddForm && (
        <Card className="p-4 bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Blackout Period
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddForm(false);
                setNewBlackout({ startDate: "", endDate: "", reason: "" });
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newBlackout.startDate}
                  onChange={(e) => setNewBlackout({ ...newBlackout, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newBlackout.endDate}
                  onChange={(e) => setNewBlackout({ ...newBlackout, endDate: e.target.value })}
                  min={newBlackout.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Input
                id="reason"
                type="text"
                placeholder="e.g., Vacation, Holiday, Personal time"
                value={newBlackout.reason}
                onChange={(e) => setNewBlackout({ ...newBlackout, reason: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddBlackout}
                disabled={createBlackout.isPending || !newBlackout.startDate || !newBlackout.endDate}
                className="flex-1"
              >
                {createBlackout.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Add Blackout"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setNewBlackout({ startDate: "", endDate: "", reason: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Upcoming Blackouts */}
      {upcomingBlackouts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Upcoming & Active</h3>
          <div className="space-y-2">
            {upcomingBlackouts.map((blackout) => {
              const startDate = new Date(blackout.startDate);
              const endDate = new Date(blackout.endDate);
              const isActive = now >= startDate && now <= endDate;
              
              return (
                <Card key={blackout.id} className={`p-4 ${isActive ? 'border-primary' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {' '}-{' '}
                          {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {isActive && (
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            Active Now
                          </span>
                        )}
                      </div>
                      {blackout.reason && (
                        <p className="text-sm text-muted-foreground">{blackout.reason}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBlackout(blackout.id)}
                      disabled={deleteBlackout.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Blackouts */}
      {pastBlackouts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Past</h3>
          <div className="space-y-2 opacity-60">
            {pastBlackouts.slice(0, 5).map((blackout) => {
              const startDate = new Date(blackout.startDate);
              const endDate = new Date(blackout.endDate);
              
              return (
                <Card key={blackout.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' '}-{' '}
                        {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {blackout.reason && (
                        <span className="text-xs text-muted-foreground">• {blackout.reason}</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBlackout(blackout.id)}
                      disabled={deleteBlackout.isPending}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {sortedBlackouts.length === 0 && (
        <Card className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Blackout Dates</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add blackout dates to block specific periods when you're unavailable.
          </p>
        </Card>
      )}
    </div>
  );
}
