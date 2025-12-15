import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";

interface AvailabilityPreviewProps {
  artistId: number;
}

export function AvailabilityPreview({ artistId }: AvailabilityPreviewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  // Get current month and year
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  // Generate calendar days for current month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  
  // Create array of days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Fetch availability for selected date
  const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const { data: availableSlots, isLoading: isLoadingSlots } = trpc.availability.getAvailableSlots.useQuery(
    {
      artistId,
      startDate: dateStr,
      endDate: dateStr,
      durationMinutes: 60, // Default 1 hour session
    },
    {
      enabled: !!selectedDate, // Only fetch when date is selected
    }
  );
  
  const handleDateClick = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };
  
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };
  
  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };
  
  const isPast = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return date < todayDate;
  };
  
  return (
    <Card className="shadow-elegant" data-testid="availability-calendar">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Check Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
            className="h-8 w-8 p-0"
          >
            ‹
          </Button>
          <span className="font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
            className="h-8 w-8 p-0"
          >
            ›
          </Button>
        </div>
        
        {/* Calendar Grid */}
        <div data-testid="date-picker" className="grid grid-cols-7 gap-1 text-center text-sm">
          {/* Day headers */}
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before month starts */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          
          {/* Calendar days */}
          {days.map((day) => {
            const past = isPast(day);
            const selected = isSelected(day);
            const today = isToday(day);
            
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            return (
              <button
                key={day}
                data-testid="calendar-date"
                data-date={dateStr}
                onClick={() => !past && handleDateClick(day)}
                disabled={past}
                className={`
                  aspect-square rounded-md text-sm transition-colors
                  ${past ? 'text-muted-foreground/40 cursor-not-allowed' : 'hover:bg-primary/10 cursor-pointer'}
                  ${selected ? 'bg-primary text-primary-foreground hover:bg-primary' : ''}
                  ${today && !selected ? 'border border-primary' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
        
        {/* Time Slots Display */}
        {selectedDate && (
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm font-medium mb-3">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            
            {isLoadingSlots ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : availableSlots && availableSlots.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableSlots.slice(0, 6).map((slot) => (
                  <button
                    key={slot.startTime}
                    data-testid="time-slot"
                    onClick={() => setSelectedTimeSlot(slot.startTime)}
                    className={`
                      w-full px-3 py-2 text-sm rounded-md border transition-colors text-left
                      ${selectedTimeSlot === slot.startTime 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'hover:bg-primary/10 border-border'
                      }
                    `}
                  >
                    <Clock className="h-3 w-3 inline mr-2" />
                    {slot.startTime} - {slot.endTime}
                  </button>
                ))}
                {availableSlots.length > 6 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    +{availableSlots.length - 6} more slots available
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No availability for this date
              </p>
            )}
            
            <Button asChild className="w-full mt-4 btn-cta" data-testid="view-availability">
              <Link href={`/book/${artistId}?date=${selectedDate.toISOString().split('T')[0]}`}>
                <CalendarIcon className="h-4 w-4 mr-2" />
                Book Now
              </Link>
            </Button>
          </div>
        )}
        
        {!selectedDate && (
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground text-center">
              Select a date to view available time slots
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
