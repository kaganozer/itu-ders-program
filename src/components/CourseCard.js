import { memo } from "react";
import { getGridRow, getDurationSpan, rowColors, dayMapping, compareTimes } from "../utils/helpers";

const Icons = {
  Tag: () => <svg className="w-3 h-3 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>,
  Clock: () => <svg className="w-3 h-3 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  Hash: () => <svg className="w-3 h-3 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>,
  Location: () => <svg className="w-3 h-3 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
  User: () => <svg className="w-3 h-3 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>,
  Users: () => <svg className="w-3 h-3 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
};

const CourseCard = memo(function CourseCard({
  group,
  baseStartHour,
  baseStartMinute,
  openDropdownId, setOpenDropdownId,
  toggleCourse,
  savedCRNs
}) {

  const colIndex = dayMapping[group.day];
  if (!colIndex) return null;

  const rowStart = getGridRow(group.startTime, baseStartHour, baseStartMinute);
  const span = getDurationSpan(group.startTime, group.endTime);
  const sortedCourses = [...group.courses].sort((a, b) => compareTimes(b.endTime, a.endTime));
  const mainCourse = sortedCourses[0];
  const count = group.courses.length;
  const isOpen = openDropdownId === group.key;

  const isMainSaved = savedCRNs.has(mainCourse.crn);

  const baseColor = rowColors[(rowStart - 2) % rowColors.length];
  const bgColorClass = isMainSaved
    ? `${baseColor} ring-1 ring-black/5 border-transparent`
    : "bg-white border-2 border-dashed border-gray-400 hover:border-gray-600 hover:bg-gray-50";
  const textColorClass = isMainSaved ? "text-white" : "text-gray-900 font-medium";
  const dynamicZIndex = isOpen ? 100 : (isMainSaved ? 40 : 10 + rowStart);
  const isFull = parseInt(mainCourse.enrolled) >= parseInt(mainCourse.capacity);

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
      {/* Kart Gövdesi */}
      <div
        className={`
                w-full p-1.5 rounded-lg flex flex-col gap-0.5 shadow-sm
                ${bgColorClass} ${textColorClass}
                ${isMainSaved ? "shadow-md" : "opacity-100"} 
                transition-all cursor-default
                h-full overflow-hidden
                group-hover:h-auto group-hover:min-h-full group-hover:overflow-visible
                group-hover:absolute group-hover:top-0 group-hover:left-0 group-hover:z-50
                group-hover:w-full
                ${isMainSaved ? '' : 'group-hover:bg-white'}
            `}
      >
        {/* Başlık ve Saat */}
        <div className={`flex justify-between items-start border-b pb-0.5 mb-0.5 ${isMainSaved ? "border-white/20" : "border-gray-200"}`}>
          <div className="flex items-center gap-0.5 pr-1 truncate leading-tight">
            <Icons.Tag />
            <div className="font-bold text-xs truncate">
              {mainCourse.branchCode} {mainCourse.courseCode}
            </div>
          </div>
          <div className={`font-mono px-1.5 py-0.5 rounded text-[10px] leading-tight ${isMainSaved ? "bg-black/10 opacity-90" : "bg-gray-100 text-gray-600 font-bold"}`}>
            {mainCourse.startTime}-{mainCourse.endTime}
          </div>
        </div>

        {/* Ders İçeriği */}
        <div className="flex-grow min-h-0 flex flex-col gap-0.5 min-w-0">
          {/* CRN ve Diğerleri Butonu */}
          {count > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setOpenDropdownId(isOpen ? null : group.key); }}
              className={`absolute right-3 px-1 rounded text-[9px] font-bold cursor-pointer transition-colors ${isMainSaved ? "bg-white/60 hover:bg-white text-current" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
            >
              +{count - 1}
            </button>
          )}

          {/* Ders Adı */}
          <div className="text-[10px] font-bold leading-tight whitespace-normal line-clamp-2 break-words mt-0.5">
            {mainCourse.courseTitle}
          </div>
          {/* CRN */}
          <div className={`flex items-center gap-0.5 text-[9px] leading-tight whitespace-normal line-clamp-1 break-words ${isMainSaved ? "opacity-80" : "text-gray-500 font-medium"}`}>
            <Icons.Hash />
            <span className="truncate">{mainCourse.crn}</span>
          </div>
          {/* Eğitmen */}
          <div className={`flex items-center gap-0.5 text-[9px] leading-tight whitespace-normal line-clamp-1 break-words ${isMainSaved ? "opacity-80" : "text-gray-500 font-medium"}`}>
            <Icons.User />
            <span>{mainCourse.instructor}</span>
          </div>
          {/* Konum */}
          <div className={`flex items-center gap-0.5 text-[9px] leading-tight truncate ${isMainSaved ? "opacity-90" : "text-gray-600 font-medium"}`}>
            <Icons.Location />
            <span className="truncate">{mainCourse.courseFormat} / {mainCourse.building} {mainCourse.classroom}</span>
          </div>
        </div>

        {/* Alt Bilgiler */}
        <div className={`mt-auto border-t pt-1.5 flex justify-between items-center ${isMainSaved ? "border-black/10" : "border-gray-200"}`}>
          {/* Kontenjan */}
          <div className={`
            flex items-center gap-0.5 text-[9px] font-mono leading-none transition-colors
            ${isMainSaved
              ? (isFull ? 'bg-white text-red-600 px-1 py-0.5 rounded font-black shadow-sm' : 'opacity-90')
              : (isFull ? 'text-red-600 font-black' : 'text-gray-500 font-bold')}
          `}>
            <Icons.Users />
            <span>
              {mainCourse.enrolled}/{mainCourse.capacity}
            </span>
          </div>

          {/* Ekle/Çıkar Butonu */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleCourse(mainCourse); }}
            className={`
                cursor-pointer px-2 py-0.5 rounded text-[9px] font-bold transition-all shadow-sm active:scale-95 flex-shrink-0 uppercase
                ${isMainSaved
                ? "bg-white hover:bg-red-50 hover:text-red-600 text-gray-800 ring-1 ring-black/5"
                : "bg-black text-white hover:bg-gray-800"} 
            `}
          >
            {isMainSaved ? "Çıkar" : "Ekle"}
          </button>
        </div>
      </div>

      {/* Diğer CRN'ler */}
      {isOpen && (
        <div className={`
            absolute top-0 w-64 bg-white text-black py-2 px-3 rounded-xl shadow-2xl border border-gray-300 z-[200]
            ${["Perşembe", "Cuma"].includes(group.day) ? "right-full mr-2" : "left-full ml-2"}
        `}>
          {/* Başlık */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-1 mb-1">
            <span className="font-black text-xs uppercase text-gray-500 tracking-wider flex items-center gap-1">Alternatifler</span>
            <button onClick={() => setOpenDropdownId(null)} className="text-gray-400 hover:text-red-600transition-colors p-1">✕</button>
          </div>

          {/* Ders Listesi */}
          <div className="max-h-64 overflow-y-auto flex flex-col gap-2 custom-scrollbar pr-1">
            {sortedCourses.map((course) => {
              const isCourseSaved = savedCRNs.has(course.crn);
              const isCourseFull = parseInt(course.enrolled) >= parseInt(course.capacity);

              return (
                <div
                  key={course.crn}
                  className={`
                    relative p-2 rounded-lg border text-[11px] transition-all duration-200
                    ${isCourseSaved
                      ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200'
                      : 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-sm'}
                  `}
                >
                  {/* Ders Kodu ve Saat */}
                  <div className="flex justify-between items-center mb-1 border-b border-black/5 pb-1">
                    <span className="font-bold text-black text-xs flex items-center gap-1">
                      <Icons.Tag /> {course.branchCode} {course.courseCode}
                    </span>
                    <span className="font-mono font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                      {course.startTime}-{course.endTime}
                    </span>
                  </div>

                  {/* Ders Adı */}
                  <div className="font-bold text-gray-900 leading-tight mb-1">
                    {course.courseTitle}
                  </div>

                  {/* Ders Bilgileri */}
                  <div className="flex flex-col text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Icons.Hash /> <span className="font-mono text-gray-800">{course.crn}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Icons.User /> <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Icons.Location /> <span>{course.courseFormat === "Yüzyüze" ? "" : course.courseFormat} {course.building} {course.classroom}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-1 pt-1 border-t border-gray-100">
                    <div className={`flex items-center gap-1 font-mono ${isCourseFull ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                      <Icons.Users /> {course.enrolled}/{course.capacity}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); toggleCourse(course); }}
                      className={`
                        w-5 h-5 rounded text-[10px] font-bold shadow-sm transition-colors
                        ${isCourseSaved
                          ? 'bg-red-100 text-red-600 hover:bg-red-200 border border-red-200'
                          : 'bg-black text-white hover:bg-gray-800'}
                      `}
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
}, (prevProps, nextProps) => {
  if (prevProps.group !== nextProps.group) return false;
  if (prevProps.openDropdownId !== nextProps.openDropdownId) {
    const wasOpen = prevProps.openDropdownId === prevProps.group.key;
    const willBeOpen = nextProps.openDropdownId === nextProps.group.key;
    if (wasOpen !== willBeOpen) return false;
  }

  const isOpen = nextProps.openDropdownId === nextProps.group.key;
  if (isOpen) return false;

  const mainCrn = nextProps.group.courses[0].crn;
  const prevStatus = prevProps.savedCRNs.has(mainCrn);
  const nextStatus = nextProps.savedCRNs.has(mainCrn);

  return prevStatus === nextStatus;
});

export default CourseCard;