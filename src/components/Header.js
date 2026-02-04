import { useState, useEffect, useRef, useMemo } from "react";

const SearchInput = ({ label, value, onChange, placeholder, options = [], onEnter, widthClass = "w-full" }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (!options || options.length === 0) return [];
    if (!value) return options;
    return options.filter(opt => opt.toLocaleUpperCase('tr-TR').includes(value.toLocaleUpperCase('tr-TR')));
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={`flex flex-col relative group ${widthClass}`}>
      <label className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">{label}</label>
      
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setShowSuggestions(false);
              if(onEnter) onEnter();
            }
          }}
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none transition-all font-semibold placeholder:font-normal placeholder:text-gray-400 h-[42px]"
        />
        
        {value && (
            <button 
                onClick={() => onChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 font-bold px-1"
            >
                ✕
            </button>
        )}
      </div>

      {showSuggestions && options.length > 0 && filteredOptions.length > 0 && (
        <div className="absolute top-full left-0 min-w-[200px] w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg mt-1 z-[100] shadow-xl custom-scrollbar">
          {filteredOptions.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => {
                onChange(opt);
                setShowSuggestions(false);
              }}
              className="px-3 py-2 cursor-pointer text-sm font-medium hover:bg-gray-100 text-gray-700 transition-colors border-b border-gray-50 last:border-0 truncate"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Header({
  branchCode, setBranchCode,
  crnFilter, setCrnFilter,
  courseCodeFilter, setCourseCodeFilter,
  courseTitleFilter, setCourseTitleFilter,
  instructorFilter, setInstructorFilter,
  handleFilter,
  allOptions
}) {
  return (
    <div className="flex flex-col gap-4 mb-6 border-b border-gray-200 pb-6">
      
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase text-black">
          İTÜ Ders Planlayıcı
        </h1>
        <p className="text-xs text-gray-500 mt-1 font-medium">
            Filtreleri kullanarak size uygun dersleri arayın ve kendi ders programınızı oluşturun.
        </p>
      </div>

      {/* Filtreler */}
      <div className="flex flex-wrap items-end gap-2 bg-white">
        
        {/* CRN Seçimi */}
        <SearchInput
            label="CRN"
            value={crnFilter} onChange={setCrnFilter}
            placeholder="20555"
            options={allOptions.crns}
            onEnter={handleFilter}
            widthClass="w-[90px] flex-shrink-0" // Sabit genişlik
        />

        {/* Branş Seçimi */}
        <SearchInput
            label="BRANŞ"
            value={branchCode} onChange={setBranchCode}
            placeholder="MAT"
            options={allOptions.branchCodes}
            onEnter={handleFilter}
            widthClass="w-[90px] flex-shrink-0"
        />

        {/* Kod Seçimi */}
        <SearchInput
            label="KOD"
            value={courseCodeFilter} onChange={setCourseCodeFilter}
            placeholder="103"
            options={allOptions.courseCodes}
            onEnter={handleFilter}
            widthClass="w-[80px] flex-shrink-0"
        />
        
        {/* Ders Adı Seçimi */}
        <SearchInput
            label="DERS ADI"
            value={courseTitleFilter} onChange={setCourseTitleFilter}
            placeholder="Matematik I"
            options={allOptions.courseTitles}
            onEnter={handleFilter}
            widthClass="flex-grow min-w-[180px]" // En az 180px olsun ama büyüyebilsin
        />

        {/* Eğitmen Seçimi */}
        <SearchInput
            label="EĞİTMEN"
            value={instructorFilter} onChange={setInstructorFilter}
            placeholder="Ad Soyad"
            options={allOptions.instructors}
            onEnter={handleFilter}
            widthClass="flex-grow min-w-[180px]"
        />

        {/* Butonlar */}
        <div className="flex gap-2 ml-auto lg:ml-0">
            {/* Temizle Butonu */}
            <button
                onClick={() => {
                    setCrnFilter(""); setBranchCode(""); setCourseCodeFilter("");
                    setCourseTitleFilter(""); setInstructorFilter("");
                }}
                className="underline h-[42px] px-4 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent"
                title="Filtreleri Temizle"
            >
                Filtreleri Temizle
            </button>

            {/* Ara Butonu */}
            <button
                onClick={handleFilter}
                className="h-[42px] px-6 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 active:scale-95 transition-all shadow-md shadow-gray-200"
            >
                DERS ARA
            </button>
        </div>

      </div>
    </div>
  );
}