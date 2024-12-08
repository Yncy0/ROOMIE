'use client'

import React, { useEffect, useState } from 'react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, setHours, setMinutes } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import supabase from "../supabaseConfig";

const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [bookings, setBookings] = useState([])

    useEffect(() => {
        fetchBookings()
    }, [currentDate])

    const fetchBookings = async () => {
        const startDate = startOfWeek(currentDate) // start of current week (Sunday)
        const endDate = endOfWeek(currentDate) // end of current week (Saturday)

        // Fetch bookings that are within the current week and that match the exact date
        const { data, error } = await supabase
            .from('booked_rooms')
            .select(`
        room_name,
        subject_code,
        section,
        time_in,
        time_out,
        date,
        status,
        user_id,
        users (user_name)
      `)
            .gte('date', startDate.toISOString()) // Filter bookings from the start of the week
            .lte('date', endDate.toISOString()) // Filter bookings until the end of the week

        if (error) {
            console.error('Error fetching bookings:', error)
            return
        }

        setBookings(data)
    }

    const weekDays = eachDayOfInterval({
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate),
    })

    const timeSlots = Array.from({ length: 15 }, (_, i) => i + 6) // 9:00 AM to 4:00 PM

    // This function will now filter bookings based on Date objects (full date & time comparison)
    const getBookingsForSlot = (day, hour) => {
        return bookings.filter((booking) => {
            // Combine the date and time to form full date-time objects
            const bookingStart = new Date(`${booking.date}T${booking.time_in}`)
            const bookingEnd = new Date(`${booking.date}T${booking.time_out}`)

            // Set the slot start time (e.g., 9:00 AM, 10:00 AM, etc.)
            const slotStart = setHours(setMinutes(day, 0), hour)
            const slotEnd = setHours(setMinutes(day, 0), hour + 1)

            // Check if the booking falls within the time slot
            return isSameDay(bookingStart, slotStart) &&
                ((bookingStart >= slotStart && bookingStart < slotEnd) ||
                    (bookingEnd > slotStart && bookingEnd <= slotEnd) ||
                    (bookingStart <= slotStart && bookingEnd >= slotEnd))
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Incoming':
                return 'bg-blue-200'
            case 'In Progress':
                return 'bg-green-200'
            case 'Complete':
                return 'bg-gray-200'
            case 'Cancelled':
                return 'bg-red-200'
            default:
                return 'bg-white'
        }
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                    {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div>
                    <Button
                        onClick={() => setCurrentDate(addDays(currentDate, -7))}
                        className="mr-2"
                    >
                        Previous Week
                    </Button>
                    <Button onClick={() => setCurrentDate(new Date())}>Today</Button>
                    <Button
                        onClick={() => setCurrentDate(addDays(currentDate, 7))}
                        className="ml-2"
                    >
                        Next Week
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-8 gap-2">
                <div className="font-bold text-center">Time</div>
                {weekDays.map((day) => (
                    <div key={day.toString()} className="font-bold text-center">
                        {format(day, 'EEE dd')}
                    </div>
                ))}
                {timeSlots.map((hour) => (
                    <React.Fragment key={hour}>
                        <div className="text-center">{`${hour}:00`}</div>
                        {weekDays.map((day) => (
                            <div
                                key={`${day}-${hour}`}
                                className="border p-1 h-24 overflow-y-auto"
                            >
                                {getBookingsForSlot(day, hour).map((booking) => (
                                    <Card
                                        key={booking.id}
                                        className={`mb-1 ${getStatusColor(booking.status)}`}
                                    >
                                        <CardContent className="p-2">
                                            <p className="text-xs font-bold">{booking.users?.user_name || 'Unknown' }</p>
                                            <p className="text-xs text-red-900">{booking.room_name}</p>
                                            <p className="text-xs">{booking.subject_code}</p>
                                            <p className="text-xs">{`${booking.section}`}</p>
                                            <p className="text-xs">{`${format(new Date(`${booking.date}T${booking.time_in}`), 'hh:mm a')} - ${format(new Date(`${booking.date}T${booking.time_out}`), 'hh:mm a')}`}</p>
                                        </CardContent>

                                    </Card>
                                ))}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

export default CalendarView
