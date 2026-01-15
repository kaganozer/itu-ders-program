"use client";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [branchCode, setBranchCode] = useState("MAT");
  const [branchList, setBranchList] = useState([]);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [courseCodeFilter, setCourseCodeFilter] = useState("226");
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const getBranches = async () => {
      try {
        const res = await fetch("/api/fetch-branches");
        const data = await res.json();
        if (Array.isArray(data)) {
          setBranchList(data);
        }
      } catch (error) {
        console.error("Brans listesine ulasilamadi: ", error);
      }
    };
    getBranches();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setScheduleData([]);
    setOpenDropdownId(null);

    try {
      const selectedBranchObj = branchList.find(b => b.code === branchCode);
      if (!selectedBranchObj) {
        throw new Error("Brans ID bulunamadi, lutfen sayfayi yenileyin.");
      }

      console.log(branchList);
      console.log(selectedBranchObj);
      const res = await fetch(`/api/fetch-courses?branchId=${selectedBranchObj.id}`);
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error);
      }

      const filteredData = json.data.filter(course => (courseCodeFilter + "E").includes(course.courseCode.split(" ").at(-1)));
      setScheduleData(filteredData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
  const dayMapping = Object.fromEntries(days.map((day, index) => [day, index + 2]));

  const getGridRow = timeStr => {
    if (!timeStr) return 1;

    const [hour, minute] = timeStr.split(":").map(Number);

    const minutesFromStart = (hour - 8) * 60 + (minute - 30);
    const rowOffset = Math.floor(minutesFromStart / 30);

    return rowOffset + 2;
  }

  const getDurationSpan = (startStr, endStr) => {
    if (!startStr || !endStr) return 2;

    const startRow = getGridRow(startStr);
    const [endH, endM] = endStr.split(":").map(Number);

    const minutesFromStart = (endH - 8) * 60 + (endM - 30);
    const endRow = Math.ceil(minutesFromStart / 30) + 2;

    return endRow - startRow;
  }

  const compareTimes = (time1, time2) => {
    if (!time1 || !time2) return 0;
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    return (h1 * 60 + m1) - (h2 * 60 + m2);
  };

  const groupCourses = useMemo(() => {
    const groups = {};

    scheduleData.forEach(course => {
      const key = `${course.day}-${course.startTime}`;

      if (!groups[key]) {
        groups[key] = {
          key,
          day: course.day,
          startTime: course.startTime,
          endTime: course.endTime,
          courses: []
        }
      }
      if (compareTimes(course.endTime, groups[key].endTime) > 0) {
        groups[key].endTime = course.endTime;
      }
      groups[key].courses.push(course);
    });
    return Object.values(groups);
  }, [scheduleData]);

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      <div className="flex gap-4 mb-8 items-end">
        <div>
          <label className="block text-sm mb-1 font-bold">Branş Kodu</label>
          <div className="relative">
            <button
              onClick={() => {
                setIsBranchOpen(!isBranchOpen);
                setSearchTerm("");
              }}
              className="flex items-center justify-between border-2 border-black p-2 w-28 text-lg font-bold uppercase bg-white cursor-pointer select-none"
            >
              <span>{branchCode}</span>
              <svg
                className={`fill-current h-4 w-4 transition-transform ${isBranchOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </button>
            {isBranchOpen && (
              <div className="absolute top-full left-0 w-28 overflow-y-auto border-2 border-t-0 border-black bg-white z-[60] shadow-xl custom-scrollbar">
                <div className="p-1 border-b-2 border-black/10 bg-gray-50 sticky top-0 z-10">
                  <input
                    autoFocus
                    type="text"
                    placeholder="ARA..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full border border-gray-300 p-1 text-sm font-bold uppercase focus:outline-none focus:border-black placeholder:text-gray-400"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {branchList
                    .filter(item => item.code.includes(searchTerm))
                    .length === 0 ? (
                    <div className="p-2 text-xs text-gray-500 text-center">Bulunamadı</div>
                  ) : (
                    branchList
                      .filter(item => item.code.includes(searchTerm))
                      .map(item => (
                        <div
                          key={item.code}
                          onClick={() => {
                            setBranchCode(item.code);
                            setIsBranchOpen(false);
                            setSearchTerm("");
                          }}
                          className={`p-2 cursor-pointer font-bold transition-colors text-sm
                                                ${branchCode === item.code ? 'bg-black text-white' : 'hover:bg-gray-200 text-black'}
                                            `}
                        >
                          {item.code}
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
            {isBranchOpen && (
              <div
                className="fixed inset-0 z-[55]"
                onClick={() => setIsBranchOpen(false)}
              />
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1 font-bold">Ders Kodu</label>
          <input
            type="text"
            value={courseCodeFilter}
            onChange={e => setCourseCodeFilter(e.target.value.toUpperCase())}
            className="border-2 border-black p-2 w-24 text-lg font-bold uppercase"
          />
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-black text-white px-6 py-3 font-bold hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Yükleniyor..." : "CRN Göster"}
        </button>
      </div>

      {error && <div className="text-red-600 mb-4 font-bold">Hata: {error}</div>}

      <div className="grid grid-cols-[80px_repeat(5,1fr)] grid-rows-[50px_repeat(18,25px)] gap-0 border-2 border-black relative">
        <div className="border-r border-b border-black p-2 bg-white"></div>
        {days.map(day => (
          <div key={day} className="border-r border-b border-black p-2 font-bold text-center flex items-center justify-center text-xl bg-white sticky top-0 z-10">
            {day}
          </div>
        ))}

        {[...Array(9)].map((_, i) => {
          const hour = 8 + i;
          return (
            <div
              key={hour}
              className="col-start-1 border-r border-b border-black flex items-start justify-end pr-2 font-mono text-lg text-gray-600"
              style={{
                gridRowStart: 2 * i + 2,
                gridRowEnd: "span 2"
              }}
            >
              {hour < 10 ? `0${hour}` : hour}:30
            </div>
          );
        })}

        {[...Array(18)].map((_, r) => (
          [...Array(5)].map((_, c) => (
            <div
              key={`cell-${r}-${c}`}
              className="border-r border-b border-gray-200"
              style={{
                gridColumn: c + 2,
                gridRow: r + 2
              }}
            />
          ))
        ))}

        {groupCourses.map((group, index) => {
          const colIndex = dayMapping[group.day];
          if (!colIndex) return null;

          const rowStart = getGridRow(group.startTime);
          const span = getDurationSpan(group.startTime, group.endTime);

          const rowColors = [
            "bg-red-600",       // 08:30
            "bg-orange-600",    // 09:00
            "bg-amber-600",     // 09:30
            "bg-yellow-700",    // 10:00
            "bg-lime-700",      // 10:30
            "bg-green-600",     // 11:00
            "bg-emerald-600",   // 11:30
            "bg-teal-600",      // 12:00
            "bg-cyan-700",      // 12:30
            "bg-sky-600",       // 13:00
            "bg-blue-600",      // 13:30
            "bg-indigo-600",    // 14:00
            "bg-violet-600",    // 14:30
            "bg-purple-600",    // 15:00
            "bg-fuchsia-700",   // 15:30
            "bg-pink-600",      // 16:00
            "bg-rose-600",      // 16:30
            "bg-slate-600"      // 17:00
          ];
          const colorClass = rowColors[(rowStart - 2) % rowColors.length] || "bg-gray-600";

          const mainCourse = group.courses[0];
          const count = group.courses.length;
          const isOpen = openDropdownId === group.key;

          const isFriday = group.day === "Cuma";
          const popupPositionClass = isFriday
            ? "right-full mr-2 origin-top-right"
            : "left-full ml-2 origin-top-left";
          const dynamicZIndex = isOpen ? 100 : 10 + rowStart;

          return (
            <div
              key={`${group.key}`}
              className={`
                relative m-[1px] group transition-all hover:!z-50
              `}
              style={{
                gridColumn: colIndex,
                gridRowStart: rowStart,
                gridRowEnd: `span ${span}`,
                zIndex: dynamicZIndex
              }}
            >
              <div
                className={`
                h-full w-full rounded p-1.5 flex flex-col justify-start shadow-sm transition-transform
                text-white overflow-hidden border border-white/10 ring-1 shadow-xl
                ${colorClass}
                ${isOpen ? 'ring-black scale-100' : 'ring-white scale-95 group-hover:scale-100'}
              `}
              >
                <div className="flex justify-between items-baseline border-b border-white/40 pb-0.5 mb-1">
                  <div className="font-bold text-sm leading-none">{mainCourse.crn} - {mainCourse.courseTitle}</div>
                  <div className="text-[12px] opacity-90 bg-black/30 px-1 py-1 rounded leading-none ml-1 whitespace-nowrap">{mainCourse.startTime}-{mainCourse.endTime}</div>
                </div>
                <div className="leading-tight truncate text-sm text-wrap">{mainCourse.instructor} - {mainCourse.courseCode}</div>
                <div className="leading-tight truncate text-sm text-wrap">{mainCourse.courseFormat} - {mainCourse.building}</div>

                {count > 1 && (
                  <button
                    onClick={() => setOpenDropdownId(isOpen ? null : group.key)}
                    className="absolute bottom-0.75 right-0.75 bg-black/30 hover:bg-black/60 cursor-pointer text-[10px] px-1.5 py-1 rounded font-bold"
                  >
                    +{count - 1} diğer CRN göster
                  </button>
                )}
              </div>


              {isOpen && (
                <div className={`absolute top-0 w-64 bg-black text-white p-3 rounded shadow-2xl border border-gray-700 cursor-auto ${popupPositionClass}`}>
                  <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-2">
                    <span className="font-bold text-yellow-400">Diğer Seçenekler</span>
                    <button
                      onClick={() => setOpenDropdownId(null)}
                      className="cursor-pointer text-gray-400 hover:text-white font-bold px-2"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto flex flex-col gap-2 custom-scrollbar">
                    {group.courses.map((course, idx) => (
                      <div key={course.crn} className={`p-2 rounded ${idx === 0 ? 'bg-red-900/50 border border-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">{course.crn} - {course.courseCode}</span>
                          <span className="text-[10px] bg-white/20 px-1 rounded">{course.startTime}-{course.endTime}</span>
                        </div>
                        <div className="text-xs text-gray-300 mt-1">{course.instructor}</div>
                        <div className="text-xs font-mono text-yellow-200">{course.courseFormat} - {course.building}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}
