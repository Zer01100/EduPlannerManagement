/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { Link, useParams } from "react-router";
import PropTypes from 'prop-types';

function DropdownCalendar({ weeks, selectedWeekId, type }) {
    const params = useParams();
    const [isOpen, setIsOpen] = useState(false);

    const getWeekName = (weeks, weekId) => {
        return weeks.find((week) => week.id === weekId)?.description || "";
    };

    return (
        <div className="relative text-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-primary-dark p-3 w-full flex gap-5 items-center justify-center font-bold text-white tracking-wide border-4 border-transparent hover:opacity-80">
                <span>Tydzień: {selectedWeekId ? getWeekName(weeks, selectedWeekId) : ""}</span>
                {!isOpen ? <FaCaretDown /> : <FaCaretUp />}
            </button>

            {isOpen && (
                <div className="bg-primary-light absolute mt-2 flex flex-col items-start p-2 w-40 z-50 text-center">
                    {weeks.map((group) => (
                        <Link
                            key={group.id}
                            to={`/${type}/${params.typeId}/week/${group.id}`}
                            onClick={() => setIsOpen(false)}
                            className="text-sm w-full text-white font-bold p-1 hover:opacity-80">
                            {group.description}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

DropdownCalendar.propTypes = {
    weeks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    })).isRequired,
    selectedWeekId: PropTypes.string,
    type: PropTypes.string.isRequired
};

export default DropdownCalendar;
