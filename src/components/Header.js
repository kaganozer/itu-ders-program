import { useState, useEffect, useRef, useMemo } from "react";

const SearchInput = ({
  label,
  value,
  onChange,
  placeholder,
  options = [],
  widthClass,
  onEnter
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (!options || options.length === 0) return [];
    if (!value) return options;
    return options.filter(opt => opt.toUpperCase().includes(value.toUpperCase()));
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
    <div ref={wrapperRef} className={`flex flex-col ${widthClass} relative group`}>
      <label className="text-xs font-bold mb-0.5">{label}</label>

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
            if (onEnter) onEnter();
          }
        }}
        placeholder={placeholder}
        className={`${["Branş Kodu", "Ders Kodu"].includes(label) && "uppercase"} border-2 px-2 py-2 text-sm font-bold focus:border-black outline-none h-[40px] w-full transition-colors placeholder:normal-case`}
      />

      {showSuggestions && options.length > 0 && filteredOptions.length > 0 && (
        <div className="absolute top-full left-0 w-full max-h-32 overflow-y-auto bg-white border-2 border-t-0 border-black z-[100] shadow-xl custom-scrollbar">
          {filteredOptions.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => {
                onChange(opt);
                setShowSuggestions(false);
              }}
              className="p-2 cursor-pointer text-sm font-bold hover:bg-black hover:text-white transition-colors border-b border-gray-100 last:border-0"
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
  showSaved,
  allOptions
}) {
  const crnOptions = allOptions.crns;
  const branchOptions = allOptions.branchCodes;
  const courseCodeOptions = allOptions.courseCodes;
  const titleOptions = allOptions.courseTitles;
  const instructorOptions = allOptions.instructors;

  return (
    <div className="flex justify-between items-end mb-6">
      <div className="flex items-end flex-wrap xl:flex-nowrap gap-2">
        <SearchInput
          label="CRN"
          value={crnFilter}
          onChange={setCrnFilter}
          placeholder="20555"
          options={crnOptions}
          widthClass="w-[5rem]"
          onEnter={handleFilter}
        />

        <div className="py-2">|</div>

        <SearchInput
          label="Branş Kodu"
          value={branchCode}
          onChange={setBranchCode}
          placeholder="MAT"
          options={branchOptions}
          widthClass="w-[5rem]"
          onEnter={handleFilter}
        />

        <SearchInput
          label="Ders Kodu"
          value={courseCodeFilter}
          onChange={setCourseCodeFilter}
          placeholder="103"
          options={courseCodeOptions}
          widthClass="w-[5rem]"
          onEnter={handleFilter}
        />

        <div className="py-2">|</div>

        <SearchInput
          label="Ders Adı"
          value={courseTitleFilter}
          onChange={setCourseTitleFilter}
          placeholder="Örn: Matematik I"
          options={titleOptions}
          widthClass="w-[16rem]"
          onEnter={handleFilter}
        />

        <div className="py-2">|</div>

        <SearchInput
          label="Eğitmen"
          value={instructorFilter}
          onChange={setInstructorFilter}
          placeholder="Örn: Aybike Özer"
          options={instructorOptions}
          widthClass="w-[16rem]"
          onEnter={handleFilter}
        />

        <div className="py-2">|</div>

        <button
          onClick={handleFilter}
          className={`cursor-pointer bg-black text-white px-6 font-bold hover:bg-gray-800 active:scale-95 transition-transform h-[40px] flex-shrink-0 mb-[1px] ${showSaved || "disabled"}`}
        >
          Ders Ara
        </button>

        <button
          onClick={() => {
            setCrnFilter("");
            setBranchCode("");
            setCourseCodeFilter("");
            setCourseTitleFilter("");
            setInstructorFilter("");
          }}
          className="cursor-pointer underline font-bold text-red-600 m-2"
        >
          Filtreleri Temizle
        </button>
      </div>
      <h1 className="text-3xl font-black tracking-tighter uppercase hidden md:block text-left">
        İTÜ Ders Planlayıcı
      </h1>
    </div>
  );
}