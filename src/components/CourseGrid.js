import { useMemo } from "react";
import { days, getGridRow } from "../utils/helpers";
import CourseCard from "./CourseCard";

export default function CourseGrid({
  groupCourses,
  openDropdownId, setOpenDropdownId,
  toggleCourse,
  isSaved
}) {
  
  const { startHour, startMinute, endHour, totalRows } = useMemo(() => {
    let minH = 8;
    let maxH = 17;
    let baseMinute = 30;
    const standartStartLimit = 8 * 60 + 30;

    groupCourses.forEach(group => {
        group.courses.forEach(c => {
            const [sH, sM] = c.startTime.split(":").map(Number);
            const [eH, eM] = c.endTime.split(":").map(Number);
            const startTotalMinutes = sH * 60 + sM;
            if (startTotalMinutes < standartStartLimit) {
              if (sH < minH) minH = sH;
              if (sM === 0) baseMinute = 0;
            }
            const effectiveEndH = eM > 0 ? eH : eH - 1; 
            if (effectiveEndH > maxH) maxH = effectiveEndH;
        });
    });
    const startTotal = minH * 60 + baseMinute;
    const endTotal = maxH * 60 + 30;
    const rows = Math.ceil((endTotal - startTotal) / 30); 

    return { startHour: minH, startMinute: baseMinute, endHour: maxH, totalRows: rows };
  }, [groupCourses]);


  return (
    <div 
        className="flex-grow w-full bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden grid grid-cols-[3.5rem_repeat(5,1fr)] md:grid-cols-[4.5rem_repeat(5,1fr)] relative isolate"
        style={{ gridTemplateRows: `3rem repeat(${totalRows}, 2rem)` }}
    >
      {/* Sol Üst Köşe */}
      <div className="border-r border-b border-gray-300 bg-gray-100"></div>

      {/* Gün Sütunları */}
      {days.map(day => (
        <div key={day} className="border-r border-b border-gray-300 bg-gray-50 p-2 flex items-center justify-center sticky top-0 z-30">
          <span className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest truncate">{day}</span>
        </div>
      ))}

      {/* Saat Sütunu */}
      {[...Array(endHour - startHour + 1)].map((_, i) => {
        const hour = startHour + i;
        const rowFor30 = getGridRow(`${hour}:30`, startHour, startMinute);        
        if(rowFor30 > 1 && rowFor30 <= totalRows + 2) {
            return (
              <div 
                key={hour} 
                className="col-start-1 border-r border-gray-300 bg-white flex items-start justify-end pr-2 md:pr-3 pt-0 relative" 
                style={{ gridRowStart: rowFor30, gridRowEnd: "span 2" }}
              >
                <span className="text-[10px] font-bold text-gray-600 font-mono -mt-2.5 transform block bg-white pl-1 z-10">
                    {hour < 10 ? `0${hour}` : hour}:30
                </span>
                <div className="absolute top-0 right-0 w-1.5 h-[1px] bg-gray-400"></div>
              </div>
            );
        }
        return null;
      })}

      {/* Arkaplan Hücreleri */}
      {[...Array(totalRows)].map((_, r) => (
        [...Array(5)].map((_, c) => {
          const isFullHourLine = r % 2 === (startMinute === 0 ? 0 : 1);

          return (
            <div
              key={`cell-${r}-${c}`}
              className={`border-r border-gray-300 ${isFullHourLine ? 'border-b border-gray-300' : 'border-b border-gray-200 border-dashed'}`}
              style={{ gridColumn: c + 2, gridRow: r + 2 }}
            />
          );
        })
      ))}

      {/* Ders Blokları */}
      {groupCourses.map((group) => (
        <CourseCard
          key={group.key}
          group={group}
          baseStartHour={startHour}
          baseStartMinute={startMinute}
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
          toggleCourse={toggleCourse}
          isSaved={isSaved}
        />
      ))}
    </div>
  );
}