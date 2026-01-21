import { useState } from "react";

export default function Header({
  branchCode, setBranchCode,
  branchList,
  courseCodeFilter, setCourseCodeFilter,
  fetchData, loading,
  savedCourses, setSavedCourses,
  showSaved, setShowSaved
}) {
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const uniqueCRNs = [...new Set(savedCourses.map(course => course.crn))];

  return (
    <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
      {/* Arama Paneli */}
      <div className={`flex flex-col gap-2 transition-opacity duration-300 ${showSaved ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex gap-4 items-end">
          {/* Branş Seçimi */}
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
                <svg className={`fill-current h-4 w-4 transition-transform ${isBranchOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
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
                    {branchList.filter(item => item.code.includes(searchTerm)).length === 0 ? (
                      <div className="p-2 text-xs text-gray-500 text-center">Bulunamadı</div>
                    ) : (
                      branchList.filter(item => item.code.includes(searchTerm)).map(item => (
                        <div
                          key={item.code}
                          onClick={() => {
                            setBranchCode(item.code);
                            setIsBranchOpen(false);
                            setSearchTerm("");
                          }}
                          className={`p-2 cursor-pointer font-bold transition-colors text-sm ${branchCode === item.code ? 'bg-black text-white' : 'hover:bg-gray-200 text-black'}`}
                        >
                          {item.code}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              {isBranchOpen && <div className="fixed inset-0 z-[55]" onClick={() => setIsBranchOpen(false)} />}
            </div>
          </div>

          {/* Ders Kodu Filtreleme */}
          <div>
            <label className="block text-sm mb-1 font-bold">Ders Kodu</label>
            <input
              type="text"
              value={courseCodeFilter}
              onChange={e => setCourseCodeFilter(e.target.value.toUpperCase())}
              className="border-2 border-black p-2 w-24 text-lg font-bold uppercase"
            />
          </div>

          {/* CRN Göster Butonu */}
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-black text-white px-6 py-3 font-bold hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "..." : "CRN Göster"}
          </button>
        </div>
        <div className="text-[11px] text-red-900 italic leading-tight max-w-md">
          * Not: &quot;MAT103&quot; yazıldığında hem &quot;MAT103&quot; (Türkçe) hem de &quot;MAT103E&quot; (İngilizce) dersleri listelenir.
          &quot;ING112A&quot;, &quot;FIZ102EL&quot; gibi sonu &quot;E&quot; ile bitmeyen özel kodlu dersler için tam kodu giriniz.
        </div>
      </div>

      {/* Program Paneli */}
      <div className="flex flex-col items-end gap-2">
        <div className="text-right">
          <div className="font-bold text-xl">Ders Programım</div>
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
            className={`px-4 py-2 cursor-pointer font-bold border-2 border-black transition-all ${showSaved ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
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
  );
}