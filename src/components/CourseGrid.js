import { days } from "../utils/helpers";
import CourseCard from "./CourseCard";

export default function CourseGrid({ groupCourses, openDropdownId, setOpenDropdownId, toggleCourse, isSaved }) {
  return (
    <div className="grid grid-cols-[5rem_repeat(5,1fr)] grid-rows-[3rem_repeat(18,2rem)] gap-0 border-2 border-black relative">
      <div className="border-r border-b border-black p-2 bg-white"></div>

      {/* Gün Sütunları */}
      {days.map(day => (
        <div key={day} className="border-r border-b border-black p-2 font-bold text-center flex items-center justify-center text-xl bg-white sticky top-0 z-10">
          {day}
        </div>
      ))}

      {/* Saat Sütunu */}
      {[...Array(9)].map((_, i) => {
        const hour = 8 + i;
        return (
          <div key={hour} className="col-start-1 border-r border-b border-black flex items-start justify-end pr-2 font-mono text-lg text-gray-600" style={{ gridRowStart: 2 * i + 2, gridRowEnd: "span 2" }}>
            {hour < 10 ? `0${hour}` : hour}:30
          </div>
        );
      })}

      {/* Arka Plan Hücreleri */}
      {[...Array(18)].map((_, r) => (
        [...Array(5)].map((_, c) => (
          <div key={`cell-${r}-${c}`} className="border-r border-b border-gray-200" style={{ gridColumn: c + 2, gridRow: r + 2 }} />
        ))
      ))}

      {/* Ders Blokları */}
      {groupCourses.map((group) => (
        <CourseCard 
          key={group.key}
          group={group}
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
          toggleCourse={toggleCourse}
          isSaved={isSaved}
        />
      ))}
    </div>
  );
}