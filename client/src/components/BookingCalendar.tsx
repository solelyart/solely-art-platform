import { useState, useMemo, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, Clock, Loader2 } from "lucide-react";

interface BookingCalendarProps {
  artistId: number;
  serviceId?: number;
  serviceDuration: number; // in minutes
  onSlotSelect: (date: string, startTime: string, endTime: string) => void;
}

export function BookingCalendar({
  artistId,
  serviceDuration,
  onSlotSelect,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null);
  const [focusedDateIndex, setFocusedDateIndex] = useState<number | null>(null);

  // Calculate date range for availability query (current month + next month)
  const dateRange = useMemo(() => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 2, 0);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }, [currentMonth]);

  // Fetch available slots for the current month
  const { data: availableSlots, isLoading } = trpc.availability.getAvailableSlots.useQuery({
    artistId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    durationMinutes: serviceDuration,
  });

  // Group slots by date
  const slotsByDate = useMemo(() => {
    if (!availableSlots) return new Map<string, typeof availableSlots>();
    
    const grouped = new Map<string, typeof availableSlots>();
    for (const slot of availableSlots) {
      if (!grouped.has(slot.date)) {
        grouped.set(slot.date, []);
      }
      grouped.get(slot.date)!.push(slot);
    }
    return grouped;
  }, [availableSlots]);

  // Get dates with availability
  const datesWithAvailability = useMemo(() => {
    return new Set(Array.from(slotsByDate.keys()));
  }, [slotsByDate]);

  // Keyboard navigation for calendar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedDate) return;

      const availableDates = Array.from(datesWithAvailability).sort();
      const currentIndex = availableDates.indexOf(selectedDate);

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (currentIndex > 0) {
            const newDate = availableDates[currentIndex - 1];
            setSelectedDate(newDate);
            setSelectedSlot(null);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentIndex < availableDates.length - 1) {
            const newDate = availableDates[currentIndex + 1];
            setSelectedDate(newDate);
            setSelectedSlot(null);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setSelectedDate(null);
          setSelectedSlot(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDate, datesWithAvailability]);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [currentMonth]);

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setSelectedSlot(null);
  };

  const handleSlotClick = (startTime: string, endTime: string) => {
    setSelectedSlot({ startTime, endTime });
  };

  const handleConfirm = () => {
    if (selectedDate && selectedSlot) {
      onSlotSelect(selectedDate, selectedSlot.startTime, selectedSlot.endTime);
    }
  };

  const isDateAvailable = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return datesWithAvailability.has(dateStr);
  };

  const isDateInPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const selectedDateSlots = selectedDate ? slotsByDate.get(selectedDate) || [] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Calendar Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-serif font-medium text-foreground">
            Select a Date
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {formatMonthYear(currentMonth)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2" data-testid="date-picker">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dateStr = date.toISOString().split('T')[0];
                const isAvailable = isDateAvailable(date);
                const isPast = isDateInPast(date);
                const isSelected = selectedDate === dateStr;
                const isToday = dateStr === new Date().toISOString().split('T')[0];

                return (
                  <button
                    key={dateStr}
                    data-date={dateStr}
                    onClick={() => !isPast && isAvailable && handleDateClick(date)}
                    disabled={isPast || !isAvailable}
                    aria-label={`${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}${isAvailable ? ', available' : ', unavailable'}${isSelected ? ', selected' : ''}`}
                    aria-pressed={isSelected}
                    tabIndex={isAvailable && !isPast ? 0 : -1}
                    className={`
                      aspect-square rounded-lg text-sm font-medium transition-all
                      ${isSelected
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : isAvailable && !isPast
                        ? 'bg-accent/10 text-foreground hover:bg-accent/20 hover:shadow-sm'
                        : 'text-muted-foreground cursor-not-allowed'
                      }
                      ${isToday && !isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                      ${isPast ? 'opacity-40' : ''}
                      disabled:cursor-not-allowed
                    `}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span>{date.getDate()}</span>
                      {isAvailable && !isPast && (
                        <span className="w-1 h-1 rounded-full bg-primary mt-1" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Dates with a dot have available time slots. Select a date to view available times.
              </p>
            </div>
          </>
        )}
      </Card>

      {/* Time Slots Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-serif font-medium text-foreground">
            Select a Time
          </h3>
          {selectedDate && (
            <span className="text-sm text-muted-foreground">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>

        {!selectedDate ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground">
              Select a date to view available time slots
            </p>
          </div>
        ) : selectedDateSlots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground">
              No available time slots for this date
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
              {selectedDateSlots.map((slot) => {
                const isSelected =
                  selectedSlot?.startTime === slot.startTime &&
                  selectedSlot?.endTime === slot.endTime;

                return (
                  <button
                    key={`${slot.startTime}-${slot.endTime}`}
                    data-testid="time-slot"
                    onClick={() => handleSlotClick(slot.startTime, slot.endTime)}
                    className={`
                      px-4 py-3 rounded-lg text-sm font-medium transition-all
                      ${isSelected
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-accent/10 text-foreground hover:bg-accent/20 hover:shadow-sm'
                      }
                    `}
                  >
                    {formatTime(slot.startTime)}
                  </button>
                );
              })}
            </div>

            {selectedSlot && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Selected Time</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)} ({serviceDuration} min)
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleConfirm}
                  className="w-full"
                  size="lg"
                >
                  Continue with this time
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
