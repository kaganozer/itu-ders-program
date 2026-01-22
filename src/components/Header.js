import { useState } from "react";

export default function Header({
  branchCode, setBranchCode, branchList,

  crnFilter, setCrnFilter,
  courseCodeFilter, setCourseCodeFilter,
  courseTitleFilter, setCourseTitleFilter,
  instructorFilter, setInstructorFilter,

  handleFilter,

  savedCourses, setSavedCourses,
  showSaved, setShowSaved
}) {
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [branchSearch, setBranchSearch] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleFilter();
  };

  const uniqueCRNs = [...new Set(savedCourses.map(course => course.crn))];

  return (
    <div className="flex flex-col gap-6 mb-8 border-b-2 border-black pb-6">
      <h1 className="text-3xl font-black tracking-tighter uppercase hidden md:block text-left">
        İTÜ Ders Programı Oluşturucu
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 items-end justify-between w-full">
        {/* Arama Paneli */}
        <div className={`flex-grow flex flex-wrap xl:flex-nowrap gap-2 items-end transition-opacity duration-300 ${showSaved ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          {/* CRN Seçimi */}
          <div className="flex flex-col w-[70px] flex-shrink-0">
            <label className="text-xs font-bold text-gray-900 mb-1">CRN</label>
            <input
              type="text"
              placeholder="12345"
              value={crnFilter}
              onChange={e => setCrnFilter(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-2 border-black p-2 text-sm font-bold"
            />
          </div>

          {/* Branş Seçimi */}
          <div className="flex flex-col w-[70px]">
            <label className="text-xs font-bold text-gray-900 mb-1">Branş Kodu</label>
            <div className="relative">
              <button
                onClick={() => {
                  setIsBranchOpen(!isBranchOpen);
                  setBranchSearch("");
                }}
                className="flex items-center justify-between border-2 border-black p-2 w-full text-sm font-bold bg-white cursor-pointer select-none"
              >
                <span>{branchCode || "-"}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {isBranchOpen && (
                <div className="w-full absolute top-full left-0 max-h-60 overflow-y-auto border-2 border-t-0 border-black bg-white z-[60] shadow-xl custom-scrollbar">
                  <input
                    autoFocus
                    className="w-full p-2 sticky top-0 bg-gray-100 border-b border-gray-300 text-sm outline-none"
                    type="text"
                    placeholder="ARA..."
                    value={branchSearch}
                    onChange={(e) => setBranchSearch(e.target.value.toUpperCase())}
                  />
                  <div
                    onClick={() => {
                      setBranchCode("");
                      setIsBranchOpen(false);
                    }}
                    className={`p-2 cursor-pointer font-bold transition-colors text-sm ${branchCode === "" ? 'bg-black text-white' : 'hover:bg-gray-200 text-black'}`}
                  >-</div>
                  {branchList.filter(item => item.code.includes(branchSearch)).map(item => (
                    <div
                      key={item.code}
                      onClick={() => {
                        setBranchCode(item.code);
                        setIsBranchOpen(false);
                      }}
                      className={`p-2 cursor-pointer font-bold transition-colors text-sm ${branchCode === item.code ? 'bg-black text-white' : 'hover:bg-gray-200 text-black'}`}
                    >
                      {item.code}
                    </div>
                  ))}
                </div>
              )}
              {isBranchOpen && <div className="fixed inset-0 z-[50]" onClick={() => setIsBranchOpen(false)} />}
            </div>
          </div>

          {/* Ders Kodu Seçimi */}
          <div className="flex flex-col w-[70px]">
            <label className="text-xs font-bold text-gray-900 mb-1">Ders Kodu</label>
            <input
              type="text"
              placeholder="101E"
              value={courseCodeFilter}
              onChange={e => setCourseCodeFilter(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              className="border-2 border-black p-2 text-sm font-bold"
            />
          </div>

          {/* Ders Adı Seçimi */}
          <div className="flex flex-col w-[200px]">
            <label className="text-xs font-bold text-gray-900 mb-1">Ders Adı</label>
            <input
              type="text"
              placeholder="Örn: Matematik III"
              value={courseTitleFilter}
              onChange={e => setCourseTitleFilter(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-2 border-black p-2 text-sm font-bold"
            />
          </div>

          {/* Eğitmen Seçimi */}
          <div className="flex flex-col w-[200px]">
            <label className="text-xs font-bold text-gray-900 mb-1">Eğitmen</label>
            <input
              type="text"
              placeholder="Örn: Aybike Özer"
              value={instructorFilter}
              onChange={e => setInstructorFilter(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-2 border-black p-2 text-sm font-bold"
            />
          </div>

          {/* Arama Butonu */}
          <button
            onClick={handleFilter}
            className="bg-black text-white px-6 py-2 font-bold hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
          >
            Dersleri Göster
          </button>

        </div>

        {/* Program Paneli */}
        <div className="flex-shrink-0 min-w-fit flex flex-col items-end justify-end ml-4 h-[62px]">
          <div className="text-right">
            <div className="text-xl font-bold uppercase tracking-wider">Ders Programım</div>
            <div className="text-sm text-gray-500 max-w-[250px] break-words">
              {uniqueCRNs.length} ders eklendi
              {uniqueCRNs.length > 0 && (
                <span className="text-xs ml-1 font-mono">
                  ({uniqueCRNs.join(", ")})
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSaved(!showSaved)}
              className={`px-6 py-2 cursor-pointer font-bold border-2 border-black transition-all ${showSaved ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
            >
              {showSaved ? "🔍 Aramaya Dön" : "📅 Programı Göster"}
            </button>

            {savedCourses.length > 0 && (
              <button
                onClick={() => { if (confirm("Tüm program silinsin mi?")) setSavedCourses([]); }}
                className="px-3 py-2 text-red-600 font-bold hover:bg-red-50 text-sm underline"
              >
                Temizle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}