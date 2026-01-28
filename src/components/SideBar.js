export default function SideBar({
    savedCourses, setSavedCourses,
    showSaved, setShowSaved,
    toggleCourse
}) {
    const uniqueCourses = [];
    const seenCrns = new Set();

    savedCourses.forEach(c => {
        if (!seenCrns.has(c.crn)) {
            uniqueCourses.push(c);
            seenCrns.add(c.crn);
        }
    });

    return (
        <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4 p-4 border-2 border-black bg-gray-50 h-fit lg:sticky lg:top-4">

            {/* Butonlar */}
            <div className="flex gap-2">
                <button
                    onClick={() => setShowSaved(!showSaved)}
                    className={`
                        w-full p-2 font-bold border-2 border-black transition-all flex items-center justify-center gap-2 cursor-pointer
                        ${showSaved ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'}
                    `}
                >
                    {showSaved ? "🔍 Aramaya Dön" : "📅 Programı Gör"}
                </button>

                <button
                    onClick={() => { if (confirm("Tüm program silinsin mi?")) setSavedCourses([]); }}
                    disabled={savedCourses.length === 0}
                    className={`p-2 font-bold text-sm transition-all
                        ${savedCourses.length === 0
                            ? 'border-2 border-gray-400 text-gray-400 cursor-not-allowed bg-gray-100'
                            : 'text-white hover:bg-red-400 cursor-pointer bg-red-600'}
                        `}
                >
                    Temizle
                </button>
            </div>

            {/* Ders Listesi */}
            <div className="border-t-2 border-black/20 pt-2">
                <h3 className="font-black text-lg">Eklenen Dersler ({uniqueCourses.length}):</h3>

                {uniqueCourses.length === 0 ? (
                    <div className="text-gray-400 text-sm italic">
                        Henüz ders eklenmedi.
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                        {uniqueCourses.map(course => (
                            <div
                                key={course.crn}
                                className="bg-white border border-gray-300 p-2 text-sm shadow-sm group hover:border-black transition-colors relative
                                    flex items-center justify-between"
                                title={course.courseTitle}
                            >
                                <div className="flex items-center">
                                    <span className="font-bold text-blue-800">{course.crn}</span>
                                    <span className="text-gray-800 ml-1">
                                        {course.branchCode} {course.courseCode}
                                    </span>
                                </div>
                                <button
                                    onClick={() => toggleCourse(course)}
                                    className="text-gray-600 hover:text-red-600 font-bold"
                                    title="Listeden çıkar"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}