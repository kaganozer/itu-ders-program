import { getGridRow, getDurationSpan, rowColors, dayMapping, compareTimes } from "../utils/helpers";

export default function CourseCard({
  group,
  baseStartHour,
  baseStartMinute,
  openDropdownId, setOpenDropdownId,
  toggleCourse,
  isSaved
}) {

  const colIndex = dayMapping[group.day];
  if (!colIndex) return null;

  const rowStart = getGridRow(group.startTime, baseStartHour, baseStartMinute);
  const span = getDurationSpan(group.startTime, group.endTime);

  const sortedCourses = [...group.courses].sort((a, b) => compareTimes(b.endTime, a.endTime));
  const mainCourse = sortedCourses[0];
  const count = group.courses.length;
  const isOpen = openDropdownId === group.key;

  const isMainSaved = isSaved(mainCourse.crn);

  const baseColor = rowColors[(rowStart - 2) % rowColors.length];
  const bgColorClass = isMainSaved
    ? `${baseColor} ring-1 ring-black/5 border-transparent`
    : "bg-white border-2 border-dashed border-gray-400 hover:border-gray-600 hover:bg-gray-50";
  const textColorClass = isMainSaved ? "text-white" : "text-gray-900 font-medium";
  const dynamicZIndex = isOpen ? 100 : (isMainSaved ? 40 : 10 + rowStart);

  return (
    <div
      style={{
        gridColumn: colIndex,
        gridRowStart: rowStart,
        gridRowEnd: `span ${span}`,
        zIndex: dynamicZIndex
      }}
      className={`
        relative group p-0.5 transition-all duration-200 
        origin-center
        ${isOpen ? '' : 'hover:!z-[60] hover:scale-[1.02]'} 
      `}
    >
      {/* --- KART GÖVDESİ --- */}
      <div
        className={`
                h-full w-full rounded-lg p-1.5 flex flex-col gap-0.5 shadow-sm overflow-hidden
                ${bgColorClass} ${textColorClass}
                ${isMainSaved ? "shadow-md" : "opacity-100"} 
                transition-all cursor-default
            `}
      >
        {/* Başlık ve Saat */}
        <div className={`flex justify-between items-start border-b pb-0.5 mb-0.5 ${isMainSaved ? "border-white/20" : "border-gray-200"}`}>
          <div className="font-bold text-xs leading-none truncate pr-1">
            {mainCourse.branchCode} {mainCourse.courseCode}
          </div>
          <div className={`text-[9px] font-mono whitespace-nowrap px-1 rounded leading-tight ${isMainSaved ? "bg-black/10 opacity-90" : "bg-gray-100 text-gray-600 font-bold"}`}>
            {mainCourse.startTime}-{mainCourse.endTime}
          </div>
        </div>

        {/* CRN ve Diğerleri Butonu */}
        <div className="flex justify-between items-center text-[10px] font-mono leading-none mb-0.5">
          <span className={isMainSaved ? "opacity-90" : "font-bold text-gray-500"}>{mainCourse.crn}</span>
          {count > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setOpenDropdownId(isOpen ? null : group.key); }}
              className={`px-1 rounded text-[9px] font-bold cursor-pointer transition-colors ${isMainSaved ? "bg-black/20 hover:bg-black/40" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
            >
              +{count - 1}
            </button>
          )}
        </div>

        {/* Eğitmen ve Ders Adı */}
        <div className="flex-grow min-h-0 flex flex-col gap-0.5 min-w-0">
          <div className="text-[10px] font-bold leading-tight whitespace-normal line-clamp-2 break-words" title={mainCourse.courseTitle}>
            {mainCourse.courseTitle}
          </div>
          <div className={`text-[9px] leading-tight whitespace-normal line-clamp-1 break-words ${isMainSaved ? "opacity-90" : "text-gray-500 font-medium"}`} title={mainCourse.instructor}>
            {mainCourse.instructor}
          </div>
        </div>

        {/* Alt Bilgiler */}
        <div className={`mt-auto pt-1 border-t flex justify-between items-end ${isMainSaved ? "border-white/20" : "border-gray-200"}`}>
          <div className={`flex flex-col text-[9px] leading-none truncate max-w-[70%] ${isMainSaved ? "opacity-90" : "text-gray-500 font-bold"}`}>
            <span className="truncate">{mainCourse.building} {mainCourse.classroom}</span>
            <span className={`font-mono mt-0.5 ${mainCourse.enrolled >= mainCourse.capacity ? 'text-red-500 font-bold' : ''}`}>
              {mainCourse.enrolled}/{mainCourse.capacity}
            </span>
          </div>

          {/* Ekle/Çıkar Butonu */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleCourse(mainCourse); }}
            className={`cursor-pointer px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors shadow-sm ${isMainSaved
              ? "bg-white/20 hover:bg-white/40 text-white"
              : "bg-black text-white hover:bg-gray-800"
              }`}
          >
            {isMainSaved ? "SİL" : "EKLE"}
          </button>
        </div>
      </div>

      {/* Diğer CRN'ler */}
      {isOpen && (
        <div className={`absolute top-0 w-56 bg-white text-black p-2 rounded-lg shadow-xl border border-gray-300 z-[200] ${["Perşembe", "Cuma"].includes(group.day)
            ? "right-full mr-1"
            : "left-full ml-1"
          }`}
        >
          <div className="flex justify-between items-center border-b border-gray-100 pb-1 mb-1">
            <span className="font-bold text-[10px] uppercase text-gray-500">Alternatifler</span>
            <button onClick={() => setOpenDropdownId(null)} className="text-gray-400 hover:text-red-600 font-bold px-1">✕</button>
          </div>
          <div className="max-h-48 overflow-y-auto flex flex-col gap-1 custom-scrollbar">
            {sortedCourses.map((course) => {
              const isCourseSaved = isSaved(course.crn);
              return (
                <div
                  key={course.crn}
                  className={`
                    relative p-1.5 rounded border text-[10px]
                    ${isCourseSaved ? 'bg-blue-50 border-blue-400 text-blue-900' : 'bg-white border-gray-200 hover:border-gray-400'}
                  `}
                >
                  <div className="flex justify-between font-bold mb-0.5">
                    <span>{course.crn}</span>
                    <span>{course.startTime}-{course.endTime}</span>
                  </div>
                  <div className="truncate opacity-80 mb-1">{course.instructor}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{course.building} {course.classroom}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleCourse(course); }}
                      className={`px-1.5 rounded font-bold ${isCourseSaved ? 'bg-red-100 text-red-600' : 'bg-gray-800 text-white hover:bg-black'}`}
                    >
                      {isCourseSaved ? "-" : "+"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}