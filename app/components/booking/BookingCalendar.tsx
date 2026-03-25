"use client";

import { useEffect, useState } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { supabase } from '../../lib/supabase';
import { format, isWithinInterval, parseISO, startOfDay, eachDayOfInterval } from 'date-fns';
import { AlertCircle } from 'lucide-react';

interface Props {
  venueId: string;
  capacity: number;
  requestedSlots: number;
  onSelectRange: (range: DateRange | undefined) => void;
}

export default function BookingCalendar({ venueId, capacity, requestedSlots, onSelectRange }: Props) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchBookings();
  }, [venueId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('check_in_date, check_out_date, status, room_count')
        .eq('venue_id', venueId)
        .in('status', ['approved', 'pending']);

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Failed to load availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFullyBookedDates = () => {
    const counts: Record<string, number> = {};
    const fullyBooked: Date[] = [];

    bookings.forEach(b => {
      if (!b.check_in_date) return;
      const start = parseISO(b.check_in_date);
      const end = b.check_out_date ? parseISO(b.check_out_date) : start;
      const slotsTaken = b.room_count || 1;
      
      const interval = eachDayOfInterval({ start, end });
      interval.forEach(day => {
        const str = format(day, 'yyyy-MM-dd');
        counts[str] = (counts[str] || 0) + slotsTaken;
      });
    });

    Object.keys(counts).forEach(str => {
      // If remaining capacity is less than what the user is currently requesting, mark as disabled
      if (counts[str] + requestedSlots > (capacity || 1)) {
        fullyBooked.push(parseISO(str));
      }
    });

    return fullyBooked;
  };

  const fullyBookedDates = getFullyBookedDates();

  const handleDaySelect = (range: DateRange | undefined, selectedDay: Date, activeModifiers: any) => {
    setErrorMessage("");

    if (activeModifiers.booked) {
      setErrorMessage(`This venue is fully booked on ${format(selectedDay, 'MMM do')}. Please select available dates.`);
      return;
    }

    // Prevent selecting a range that crosses a fully booked date
    if (range?.from && range?.to) {
      const daysInSpan = eachDayOfInterval({ start: range.from, end: range.to });
      const collision = daysInSpan.some(day => 
        fullyBookedDates.some(booked => format(booked, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
      );

      if (collision) {
        setErrorMessage("Your selected stay includes a date that is already fully booked.");
        return;
      }
    }

    setSelectedRange(range);
    onSelectRange(range);
  };

  if (loading) return <div className="text-gray-400 text-xs py-8 text-center animate-pulse">Loading Live Availability...</div>;

  return (
    <div className="bg-white border text-hotel-black border-gray-100 rounded-sm shadow-sm overflow-hidden flex flex-col items-center justify-center p-2 relative text-xs">
      <style>{`
        .rdp { 
          --rdp-cell-size: 32px !important; 
          --rdp-accent-color: #8B7355; 
          --rdp-background-color: #F8F5F2; 
          margin: 0; 
          font-size: 12px;
        }
        .booked-day { text-decoration: line-through; color: #ccc; background-color: #fafafa; border-radius: 50%; }
        .rdp-day_selected:not(.rdp-day_outside) { font-weight: bold; }
      `}</style>
      
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={(range, day, modifiers) => handleDaySelect(range, day, modifiers)}
        min={1}
        modifiers={{ booked: fullyBookedDates }}
        modifiersClassNames={{ booked: 'booked-day' }}
        disabled={[{ before: new Date() }]} // Cannot book in the past
      />

      {errorMessage && (
        <div className="w-full bg-red-50 text-red-600 p-3 mt-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
          <AlertCircle size={14} /> {errorMessage}
        </div>
      )}
    </div>
  );
}
