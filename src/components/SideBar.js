import { useState } from "react";
import dbData from "../data/courses.json";

export default function SideBar({
    savedCourses, setSavedCourses,
    showSaved, setShowSaved,
    toggleCourse,
    onScrollToCalendar,
    onScrollToHeader
}) {
    const [showImport, setShowImport] = useState(false);
    const [importText, setImportText] = useState("20418, 23540, 23554, 23556, 20868, 20079");
    const [copied, setCopied] = useState(false);

    const uniqueCourses = [];
    const seenCrns = new Set();

    savedCourses.forEach(c => {
        if (!seenCrns.has(c.crn)) {
            uniqueCourses.push(c);
            seenCrns.add(c.crn);
        }
    });

    const handleBulkImport = () => {
        if (!importText.trim()) return;
        const crnsToFind = importText.split(/[\s,]+/).filter(Boolean);
        if (crnsToFind.length === 0) return;

        const foundCourses = dbData.courses.filter(course => crnsToFind.includes(course.crn));

        if (foundCourses.length === 0) {
            alert("Girilen CRN'lerle eşleşen ders bulunamadı.");
            return;
        }

        setSavedCourses(prev => {
            const existingCrns = new Set(prev.map(c => c.crn));
            const newUniqueCourses = foundCourses.filter(c => !existingCrns.has(c.crn));
            return [...prev, ...newUniqueCourses];
        });

        setImportText("");
        setShowImport(false);
    };

    const handleCopyCRNs = () => {
        if (uniqueCourses.length === 0) return;
        const crnString = uniqueCourses.map(c => c.crn).join(", ");

        navigator.clipboard.writeText(crnString).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm h-fit lg:sticky lg:top-8 transition-all">
            {/* Butonlar */}
            <div className="flex gap-2">
                {/* Programı Göster Butonu */}
                <button
                    onClick={() => {
                        if (showSaved) onScrollToHeader();
                        else onScrollToCalendar();
                        setShowSaved(!showSaved);
                    }}
                    className={`
                        flex-grow py-3 px-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-sm
                        ${showSaved
                            ? 'bg-gray-900 text-white hover:bg-black ring-2 ring-gray-900 ring-offset-2'
                            : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'}
                    `}
                >
                    {showSaved ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <span>Aramaya Dön</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <span>Programı Gör</span>
                        </>
                    )}
                </button>

                {/* Temizle Butonu */}
                <button
                    onClick={() => { if (confirm("Tüm program silinsin mi?")) setSavedCourses([]); }}
                    disabled={savedCourses.length === 0}
                    title="Listeyi Temizle"
                    className={`
                        flex-shrink-0 w-12 flex items-center justify-center rounded-xl border transition-colors
                        ${savedCourses.length === 0
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                            : 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300'}
                    `}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>

            {/* CRN ile Ders Ekleme */}
            <div className="bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden">
                <button
                    onClick={() => setShowImport(!showImport)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 rounded p-0.5">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        </span>
                        <span>CRN ile Ders Ekle</span>
                    </div>
                    <span className={`transform transition-transform text-gray-400 ${showImport ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {showImport && (
                    <div className="p-3 pt-0 border-t border-gray-100 bg-white">
                        <p className="text-[10px] text-gray-400 mb-2 mt-2">Eklenecek CRN'ler:</p>
                        <textarea
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                            placeholder="Örn: 23554, 23540..."
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none h-20 resize-none font-mono text-gray-700 placeholder:text-gray-400"
                        />
                        <button
                            onClick={handleBulkImport}
                            className="mt-2 w-full bg-black hover:bg-gray-800 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-sm"
                        >
                            Listeye Ekle
                        </button>
                    </div>
                )}
            </div>

            <hr className="border-gray-100" />

            {/* Eklenen Dersler Listesi */}
            <div>
                <div className="flex justify-between items-baseline mb-3">
                    <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider">
                        <span>Eklenen Dersler - </span>
                        <span className="text-xs font-bold text-black bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                            {uniqueCourses.length}
                        </span>
                    </h3>
                    <div className="flex items-center gap-2">
                        {/* Kopyala Butonu */}
                        <button
                            onClick={handleCopyCRNs}
                            className={`
                                flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all
                                ${copied
                                    ? 'bg-green-100 text-green-700 border-green-200'
                                    : 'bg-white text-gray-500 border-gray-200 hover:text-black hover:border-gray-400'
                                }
                            `}
                            title="CRN Listesini Kopyala"
                        >
                            {copied ? (<>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span>Kopyalandı</span>
                            </>) : (<>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                <span>Kopyala</span>
                            </>)}
                        </button>
                    </div>
                </div>

                {uniqueCourses.length === 0 ? (
                    <div className="text-center py-6 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-sm font-medium">Listeniz boş.</p>
                        <p className="text-[11px] text-gray-400 mt-1">Takvimden seçin veya CRN girin.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                        {uniqueCourses.map(course => (
                            <div
                                key={course.crn}
                                className="group flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg hover:border-black hover:shadow-sm transition-all duration-200"
                            >
                                <div className="flex flex-col overflow-hidden">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-black">{course.branchCode} {course.courseCode}</span>
                                        <span className="text-[10px] font-mono bg-gray-100 px-1 rounded text-gray-500">{course.crn}</span>
                                    </div>
                                    <div className="text-[11px] text-gray-500 truncate w-full mt-0.5" title={course.courseTitle}>
                                        {course.courseTitle}
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleCourse(course)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    title="Listeden çıkar"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}