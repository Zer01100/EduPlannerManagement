import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewDay, createViewWeek } from "@schedule-x/calendar";
import '@schedule-x/theme-default/dist/calendar.css';
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import "./Calendar.css";
import { useState } from "react";

const Calendar = ({ events = [], controls }) => {
    const eventModal = createEventModalPlugin();
    const eventsService = useState(() => createEventsServicePlugin())[0];

    // Dodajemy dodatkowe klasy do ka??dego eventu
    const typedEvents = events.map((event) => ({
        ...event,
        _options: {
            ...(event._options || {}),
            additionalClasses: [`event-${event.type || 'default'}`],
        },
    }));

    const calendar = useCalendarApp({
        theme: 'shadcn',
        views: [createViewWeek(), createViewDay()],
        locale: 'pl-PL',
        defaultView: createViewWeek.name,
        selectedDate: "2024-09-23",
        minDate: '2024-09-23',
        maxDate: '2025-02-17',
        dayBoundaries: {
            start: '07:00',
            end: '21:00',
        },
        weekOptions: {
            gridHeight: 700,
            nDays: 7,
        },
        plugins: [eventModal, eventsService, createCurrentTimePlugin(), controls],
    });

    eventModal.close(); // opcjonalnie zamyka modal startowo
    eventsService.set(typedEvents); // Ustawiamy wydarzenia z klasami

    return (
        <div>
            <ScheduleXCalendar calendarApp={calendar} />
        </div>
    );
};

export default Calendar;