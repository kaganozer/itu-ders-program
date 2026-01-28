import { getGridRow, getDurationSpan, rowColors, dayMapping, compareTimes } from "../utils/helpers";

export default function CourseCard({
  group,
  openDropdownId, setOpenDropdownId,
  toggleCourse,
  isSaved
}) {

  const colIndex = dayMapping[group.day];
  if (!colIndex) return null;

  const rowStart = getGridRow(group.startTime);
  const span = getDurationSpan(group.startTime, group.endTime);
  const colorClass = rowColors[(rowStart - 2) % rowColors.length] || "bg-gray-600";

  const sortedCourses = [...group.courses].sort((a, b) => compareTimes(b.endTime, a.endTime));
  const mainCourse = sortedCourses[0];
  const count = group.courses.length;
  const isOpen = openDropdownId === group.key;
  const popupPositionClass = ["Perşembe", "Cuma"].includes(group.day) ? "right-full mr-2 origin-top-right" : "left-full ml-2 origin-top-left";
  const dynamicZIndex = isOpen ? 100 : 10 + rowStart;

  const isMainSaved = isSaved(mainCourse.crn);

  return (
    <div
      style={{ gridColumn: colIndex, gridRowStart: rowStart, gridRowEnd: `span ${span}`, zIndex: dynamicZIndex }}
      className={`relative group transition-all hover:!z-50 text-wrap`}
    >
      <div className={`
        ${colorClass}
        h-full w-full rounded p-1.5 flex flex-col justify-start shadow-sm transition-transform text-white overflow-hiddenshadow-xl
        ${isMainSaved || isOpen ? "ring-black ring-3" : "ring-white ring-2"}
        ${isOpen ? 'scale-100' : 'scale-95 group-hover:scale-100'}
      `}>

        <div className="flex justify-between items-baseline border-b border-white/40 pb-0.5 mb-1">
          <div className="font-bold text-sm leading-none">{mainCourse.crn} - {mainCourse.branchCode} {mainCourse.courseCode}</div>
          <div className="text-[12px] opacity-90 bg-black/30 px-1 py-1 rounded leading-none ml-1 whitespace-nowrap">{mainCourse.startTime}-{mainCourse.endTime}</div>
        </div>

        <div className="leading-tight truncate text-sm text-wrap">📝 {mainCourse.instructor} - {mainCourse.courseTitle}</div>
        <div className="leading-tight truncate text-sm text-wrap">🏛️ {mainCourse.courseFormat} - {mainCourse.building} {mainCourse.classroom}</div>
        <div className="leading-tight truncate text-sm text-wrap">👥 {mainCourse.enrolled || "?"} / {mainCourse.capacity || "?"}</div>

        <div className="flex justify-between mt-auto">
          {/* Kaydet */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleCourse(mainCourse); }}
            className={`bg-black/30 hover:bg-black/60 cursor-pointer text-[12px] px-1.5 py-0.5 rounded font-bold`}
            title={isMainSaved ? "Programdan Çıkar" : "Programa Ekle"}
          >
            {isMainSaved ? "Çıkar" : "Ekle"}
          </button>

          {/* Diğer CRN Göster */}
          {count > 1 && (
            <button
              onClick={() => setOpenDropdownId(isOpen ? null : group.key)}
              className="bg-black/30 hover:bg-black/60 cursor-pointer text-[12px] px-1.5 py-0.5 rounded font-bold"
            >
              +{count - 1} diğer
            </button>
          )}
        </div>
      </div>

      {/* Diğer CRN'ler */}
      {isOpen && (
        <div className={`absolute top-0 w-64 bg-black text-white p-3 rounded shadow-2xl border border-gray-700 cursor-auto ${popupPositionClass}`}>
          <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-2">
            <span className="font-bold text-yellow-400">Alternatifler</span>
            <button onClick={() => setOpenDropdownId(null)} className="cursor-pointer text-gray-400 hover:text-white font-bold px-2">✕</button>
          </div>
          <div className="max-h-60 overflow-y-auto flex flex-col gap-2 custom-scrollbar">
            {sortedCourses.map((course, idx) => {
              const isThisSaved = isSaved(course.crn);
              return (
                <div key={course.crn} className={`relative p-2 rounded ${idx === 0 ? 'bg-red-900/50 border border-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{course.crn} - {mainCourse.branchCode} {course.courseCode}</span>
                    <span className="text-[10px] bg-white/20 px-1 rounded">{course.startTime}-{course.endTime}</span>
                  </div>
                  <div className="text-xs text-gray-300">{course.courseTitle}</div>
                  <div className="text-xs text-gray-300">{course.instructor}</div>
                  <div className="text-xs font-mono text-yellow-200">{course.courseFormat} - {course.building} {course.classroom}</div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleCourse(course); }}
                    className={`absolute bottom-2 right-2 bg-black/30 hover:bg-black/60 cursor-pointer text-xs px-1.5 py-0.5 rounded`}
                  >
                    {isThisSaved ? "Çıkar" : "Ekle"}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}