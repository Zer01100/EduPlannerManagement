/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import '@schedule-x/theme-default/dist/calendar.css'
import "../../components/calendar/Calendar.css"
import { useEffect, useState } from "react";
import DropdownCalendar from "../../components/calendar/DropdownCalendar.jsx";
import Calendar from "../../components/calendar/Calendar.jsx";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import ApiService from "../../services/ApiService.js";
import { useParams } from "react-router";

const TimesView = ({ resource }) => {
    const { typeId, weekId } = useParams();
    const [weeks, setWeeks] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [events, setEvents] = useState([]);
    const controls = useState(() => createCalendarControlsPlugin())[0]
    const [date, setDate] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            await fetchAndSetWeeks();
            await fetchAndSetActualWeek();
        }
        fetchData();
    }, []);

    useEffect(() => {
        fetchAndSetTimes();
    }, [typeId]);

    useEffect(() => {
        fetchAndSetTimes();
        fetchAndSetWeek();
    }, [weekId]);

    const fetchAndSetTimes = async () => {
        const times = await fetchTimes([1, 2, 3, 4]);
        setEvents(times);
    };

    const fetchAndSetWeek = async () => {
        const date = await fetchWeek();
        controls.setDate(date)
    }

    const fetchAndSetActualWeek = async () => {
        const currentWeek = await fetchActualWeek();
        if (selectedWeek === currentWeek)
            return;
        setSelectedWeek(currentWeek);
    }

    const fetchActualWeek = async () => {
        const currentDate = new Date();
        const currentWeek = await ApiService.getCurrentWeek(currentDate.toISOString());
        return currentWeek;
    }

    const fetchTimes = async (ids) => {
        const response = await ApiService.getTimes(resource, typeId, weekId, ids);

        const courses = !response.courses ? [] : response.courses.map(course => ({
            id: course.id,
            title: course.course.shortcut,
            fullTitle: course.course.name,
            type: course.course.type,
            start: formatDate(course.startDate),
            end: formatDate(course.endDate),
            location: (course.rooms.length > 0 ? course.rooms[0].nr : "Nie podano"),
            roomId: (course.rooms.length > 0 ? course.rooms[0].id : null),
            description: course.groups.map(g => g.shortcut).join(", "),
            groupId: (course.groups.length > 0 ? course.groups[0].id : null),
            conductor: course.teachers?.map(t => `${t.name} ${t.surname}`).join(", ") || "Nie podano",
            teacherId: (course.teachers && course.teachers.length > 0 ? course.teachers[0].id : null),
            classNames: [`event-${course.course.type?.toLowerCase()}`]
        }));

        const reservations = !response.reservations ? [] : response.reservations.map(reservation => ({
            id: reservation.id,
            title: reservation.type || reservation.description,
            fullTitle: reservation.description,
            type: reservation.type,
            start: formatDate(reservation.startDate),
            end: formatDate(reservation.endDate),
            location: (reservation.rooms.length > 0 ? reservation.rooms[0].nr : "Nie podano"),
            roomId: (reservation.rooms.length > 0 ? reservation.rooms[0].id : null),
            description: reservation.groups.map(g => g.shortcut).join(", "),
            groupId: (reservation.groups.length > 0 ? reservation.groups[0].id : null),
            conductor: "Brak danych",
            teacherId: null
        }));

        return courses.concat(reservations);
    }

    const fetchAndSetWeeks = async () => {
        const weeks = await ApiService.getWeeks();
        setWeeks(weeks);
    }

    const fetchWeek = async () => {
        const response = await ApiService.getWeekById(weekId);
        const date = new Date(response.startWeek);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, "0")}`;
    }

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    return (
        <div className="overflow-auto">
            <div className="pb-4 flex flex-row">
                <DropdownCalendar type={resource} weeks={weeks} date={date} />
            </div>
            <Calendar events={events} controls={controls} />
        </div>
    );
};

export default TimesView;
