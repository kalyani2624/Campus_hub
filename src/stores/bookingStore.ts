import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export interface SeatBooking {
  id: string;
  userId: string;
  timeSlot: TimeSlot;
  date: string;
}

export interface CabinBooking {
  cabinId: number;
  userId: string;
  timeSlot: TimeSlot;
  date: string;
}

interface BookingState {
  totalSeats: number;
  seatBookings: SeatBooking[];
  cabinBookings: CabinBooking[];
  bookSeat: (userId: string, timeSlot: TimeSlot, date: string) => boolean;
  bookCabin: (cabinId: number, userId: string, timeSlot: TimeSlot, date: string) => boolean;
  getAvailableSeats: (timeSlot: TimeSlot, date: string) => number;
  getBookedSeats: (timeSlot: TimeSlot, date: string) => number;
  isCabinAvailable: (cabinId: number, timeSlot: TimeSlot, date: string) => boolean;
  getUserBookings: (userId: string) => SeatBooking[];
  getUserCabinBookings: (userId: string) => CabinBooking[];
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      totalSeats: 50,
      seatBookings: [],
      cabinBookings: [],
      
      bookSeat: (userId: string, timeSlot: TimeSlot, date: string) => {
        const state = get();
        const bookedCount = state.seatBookings.filter(
          (b) => b.timeSlot === timeSlot && b.date === date
        ).length;
        
        if (bookedCount >= state.totalSeats) return false;
        
        const newBooking: SeatBooking = {
          id: `${userId}-${timeSlot}-${date}-${Date.now()}`,
          userId,
          timeSlot,
          date,
        };
        
        set({ seatBookings: [...state.seatBookings, newBooking] });
        return true;
      },
      
      bookCabin: (cabinId: number, userId: string, timeSlot: TimeSlot, date: string) => {
        const state = get();
        const isBooked = state.cabinBookings.some(
          (b) => b.cabinId === cabinId && b.timeSlot === timeSlot && b.date === date
        );
        
        if (isBooked) return false;
        
        set({
          cabinBookings: [...state.cabinBookings, { cabinId, userId, timeSlot, date }],
        });
        return true;
      },
      
      getAvailableSeats: (timeSlot: TimeSlot, date: string) => {
        const state = get();
        const bookedCount = state.seatBookings.filter(
          (b) => b.timeSlot === timeSlot && b.date === date
        ).length;
        return state.totalSeats - bookedCount;
      },
      
      getBookedSeats: (timeSlot: TimeSlot, date: string) => {
        const state = get();
        return state.seatBookings.filter(
          (b) => b.timeSlot === timeSlot && b.date === date
        ).length;
      },
      
      isCabinAvailable: (cabinId: number, timeSlot: TimeSlot, date: string) => {
        const state = get();
        return !state.cabinBookings.some(
          (b) => b.cabinId === cabinId && b.timeSlot === timeSlot && b.date === date
        );
      },
      
      getUserBookings: (userId: string) => {
        return get().seatBookings.filter((b) => b.userId === userId);
      },
      
      getUserCabinBookings: (userId: string) => {
        return get().cabinBookings.filter((b) => b.userId === userId);
      },
    }),
    {
      name: 'campus-booking-storage',
    }
  )
);
