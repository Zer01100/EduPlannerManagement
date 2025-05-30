/* eslint-disable react/prop-types */
import {useEffect, useState} from 'react';
import {FaCaretDown, FaCaretUp} from "react-icons/fa6";
import {Link} from "react-router";
import ApiService from "../services/ApiService.js";

function Dropdown({title, groups, type}) {
  const [isOpen, setIsOpen] = useState(false);
  const [week, setWeek] = useState(0);
  
  useEffect(() => {
    const getWeekId = () => {
      const date = new Date();
      const formattedDAte = `${date.getFullYear()}.${date.getMonth() +1}.${date.getDate()}`;
      const response = ApiService.getCurrentWeek(formattedDAte);
      response.then(data => {
        setWeek(data.id);
      });
    }
    getWeekId()
  }, []);

  return (
    <div className="relative text-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-light p-1 w-full flex items-center justify-between font-bold text-white tracking-wide border-4 border-transparent  hover:opacity-80">
        {title}
        {!isOpen ? (<FaCaretDown/>): (<FaCaretUp/>)}
      </button>
      
      {isOpen && (
        <div className="bg-primary-light absolute mt-2 flex flex-col items-start p-2 w-full">
          {groups.map((group) => {
            const optionTitle = group.shortcut ? group.shortcut :
                                  group.name && group.surname ? `${group.name} ${group.surname}` : group.nr ? group.nr : "Nic";
            
            console.log(type)
            return (
                <Link key={group.id} to={`/${type}/${group.id}/week/${week}`} className="text-sm w-full text-white font-bold p-2 hover:opacity-80">{optionTitle}</Link>
              )
          })}
        </div>
      )}
      
    </div>
  );
}

export default Dropdown;
