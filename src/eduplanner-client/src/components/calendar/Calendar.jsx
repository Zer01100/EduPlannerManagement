import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewDay, createViewWeek } from "@schedule-x/calendar";
import '@schedule-x/theme-default/dist/calendar.css';
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import "./Calendar.css";
import { useState } from "react";

const Calendar = ({ events = [], controls, weekId, typeId }) => {
    const eventModal = createEventModalPlugin();
    const eventsService = useState(() => createEventsServicePlugin())[0];

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

    eventModal.close();
    eventsService.set(typedEvents);

    const customComponents = {
        eventModal: ({ calendarEvent }) => {
            return (
                <div className="sx__event-modal sx__event-modal-default is-open" tabIndex={0}>
                    <div className="sx__has-icon sx__event-modal__title">
                        <div
                            className={`sx__event-modal__color-icon sx__event-icon ${calendarEvent._options?.additionalClasses?.join(' ') || ''} no-border`} 
                            style={{ border: 'none' }}
                        ></div>
                        {calendarEvent.title}
                    </div>

                    <div className="sx__has-icon sx__event-modal__time">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sx__event-icon">
                            <path d="M12 8V12L15 15" stroke="var(--sx-internal-color-text)" strokeWidth="2" strokeLinecap="round"></path>
                            <circle cx="12" cy="12" r="9" stroke="var(--sx-internal-color-text)" strokeWidth="2"></circle>
                        </svg>
                        {calendarEvent.start} * {calendarEvent.end}
                    </div>

                    <div className="sx__has-icon sx__event-modal__location">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sx__event-icon">
                            <path d="M12 22L17.5 16.5C20.5376 13.4624 20.5376 8.53757 17.5 5.5C14.4624 2.46244 9.53757 2.46244 6.5 5.5C3.46244 8.53757 3.46244 13.4624 6.5 16.5L12 22Z" stroke="var(--sx-internal-color-text)" strokeWidth="2" strokeLinejoin="round"></path>
                        </svg>
                        {calendarEvent.roomId ? (
                            <a href={`/room/${calendarEvent.roomId}/week/${weekId}`}>
                                {calendarEvent.location}
                            </a>
                        ) : "Brak danych"}
                    </div>

                    <div className="sx__has-icon sx__event-modal__instructor" style={{ marginTop: "8px" }}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sx__event-icon" style={{ width: "20px", height: "20px" }}>
                            <circle cx="12" cy="7" r="4" stroke="var(--sx-internal-color-text)" strokeWidth="2"></circle>
                            <path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" stroke="var(--sx-internal-color-text)" strokeWidth="2" strokeLinecap="round"></path>
                        </svg>
                        {calendarEvent.conductorId ? (
                            <a href={`/teacher/${calendarEvent.conductorId}/week/${weekId}`}>
                                {calendarEvent.conductor || "Nie podano"}
                            </a>
                        ) : (
                            calendarEvent.conductor || "Nie podano"
                        )}
                    </div>

                    <div className="sx__has-icon sx__event-modal__description">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sx__event-icon">
                            <rect x="4" y="4" width="16" height="16" rx="3" stroke="var(--sx-internal-color-text)" strokeWidth="2"></rect>
                            <path d="M16 10L8 10" stroke="var(--sx-internal-color-text)" strokeWidth="2" strokeLinecap="round"></path>
                            <path d="M16 14L8 14" stroke="var(--sx-internal-color-text)" strokeWidth="2" strokeLinecap="round"></path>
                        </svg>
                        <div className="sx__has-icon sx__event-modal__group">
                            <a href={`/group/${calendarEvent.groupId}/week/${weekId}`}>
                                {calendarEvent.description}
                            </a>
                        </div>
                    </div>


                </div>
            );
        },
    };

    return (
        <div>
            <ScheduleXCalendar
                calendarApp={calendar}
                customComponents={customComponents}
            />
        </div>
    );
};

export default Calendar;
