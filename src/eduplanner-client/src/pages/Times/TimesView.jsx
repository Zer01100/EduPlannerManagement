/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import '@schedule-x/theme-default/dist/calendar.css'
import "../../components/calendar/Calendar.css"
import {useEffect, useRef, useState} from "react";
import DropdownCalendar from "../../components/calendar/DropdownCalendar.jsx";
import Calendar from "../../components/calendar/Calendar.jsx";
import {createCalendarControlsPlugin} from "@schedule-x/calendar-controls";
import ApiService from "../../services/ApiService.js";
import {useParams} from "react-router";

const TimesView = ({resource}) => {
  const {typeId, weekId} = useParams();

  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [events, setEvents] = useState([]);
  
  const controls = useState(() => createCalendarControlsPlugin())[0]
  const[date, setDate] = useState(null);
  
  useEffect(() => {
      const fetchData = async () => {
          await fetchAndSetWeeks();
          await fetchAndSetActualWeek();
      }
      fetchData();
  }, []);
    
  useEffect(() => {
      console.log("typeId");
    fetchAndSetTimes();
  }, [typeId]) 
  
  useEffect(() => {
      console.log("weekId");
      fetchAndSetTimes();
      fetchAndSetWeek();
  }, [weekId]);

  const fetchAndSetTimes = async () => {
    const times = await fetchTimes([1,2,3,4]);
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
  
  const fetchActualWeek = async () =>{
      const currentDate = new Date();
      const currentWeek = await ApiService.getCurrentWeek(currentDate.toISOString());
      return currentWeek;
  }

  const fetchTimes = async (ids) => {
    const response = await ApiService.getTimes(resource, typeId, weekId, ids);
      console.log(response);

      const courses = !response.courses ? [] : response
        .courses
        .map((course) => ({
            id: course.id,
            title: course.course.shortcut,
            fullTitle: course.course.name,
            type: course.course.type,
            start: formatDate(course.startDate, course.minutesStart),
            end: formatDate(course.endDate, course.minutesEnd),
            location: (course.rooms.length > 0 ? course.rooms[0].nr  : "Nie podano"),
            description: course.groups.map((group) => group.shortcut).join(", "),
            classNames: [`event-${course.course.type?.toLowerCase()}`]
          })
        );
    
    const reservations = !response.reservations ? [] : response
        .reservations
        .map(reservation => ({
          id: reservation.id,
          title: reservation.type || reservation.description,
          fullTitle: reservation.description,
          type: reservation.type,
          start: formatDate(reservation.startDate, reservation.minutesStart),
          end: formatDate(reservation.endDate, reservation.minutesEnd),
          location: (reservation.rooms.length > 0 ? reservation.rooms[0].nr  : "Nie podano"),
          description: reservation.groups.map((group) => group.shortcut).join(", ")
          })
        );
    
    return courses.concat(reservations);
  }

  const fetchAndSetWeeks = async () =>{
      const weeks = await ApiService.getWeeks();
      setWeeks(weeks);
  }
  
  const fetchWeek = async () => {
    const response = await ApiService.getWeekById(weekId);
    var date = new Date(response.startWeek);
    var formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, "0")}`;
    return formattedDate;
  }
  
  const formatDate = (stringDate, addMinutes) => {
    const now = new Date(stringDate);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Dodaje wiodące zero
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes() ).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  
  return (
      <div className="overflow-auto s">
        <div className="pb-4 flex flex-row ">
          <DropdownCalendar type={resource} weeks={weeks} date={date} />
        </div>
        <div>

          <Calendar events={events} controls={controls} />
        </div>
      </div>
  );
};

export default TimesView;
