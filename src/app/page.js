"use client";
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import CourseGrid from "../components/CourseGrid";
import { compareTimes } from "../utils/helpers";

export default function Home() {
  const [branchCode, setBranchCode] = useState("MAT");
  const [branchList, setBranchList] = useState([]);
  const [courseCodeFilter, setCourseCodeFilter] = useState("226");
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const getBranches = async () => {
      try {
        const res = await fetch("/api/fetch-branches");
        const data = await res.json();
        if (Array.isArray(data)) setBranchList(data);
      } catch (err) {
        console.error(err);
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
      if (!selectedBranchObj) throw new Error("Branş bulunamadı.");

      const res = await fetch(`/api/fetch-courses?branchId=${selectedBranchObj.id}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      const filtered = json.data.filter(course => {
        const currentCourseCode = course.courseCode.split(" ").at(-1);
        return currentCourseCode === courseCodeFilter || currentCourseCode === courseCodeFilter + "E";
      });
      setScheduleData(filtered);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = (course) => {
    setSavedCourses((prev) => {
      const exists = prev.find((c) => c.crn === course.crn);
      return exists
        ? prev.filter((c) => c.crn !== course.crn)
        : [...prev, ...scheduleData.filter(c => c.crn === course.crn)];
    });
  };

  const isSaved = (crn) => savedCourses.some((c) => c.crn === crn);

  const activeData = showSaved ? savedCourses : scheduleData;

  const groupCourses = useMemo(() => {
    const groups = {};
    activeData.forEach(course => {
      const key = `${course.day}-${course.startTime}`;
      if (!groups[key]) {
        groups[key] = { key, day: course.day, startTime: course.startTime, endTime: course.endTime, courses: [] };
      }
      if (compareTimes(course.endTime, groups[key].endTime) > 0) {
        groups[key].endTime = course.endTime;
      }
      groups[key].courses.push(course);
    });
    return Object.values(groups);
  }, [activeData]);

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      <Header
        branchCode={branchCode} setBranchCode={setBranchCode}
        branchList={branchList}
        courseCodeFilter={courseCodeFilter} setCourseCodeFilter={setCourseCodeFilter}
        fetchData={fetchData} loading={loading}
        savedCourses={savedCourses} setSavedCourses={setSavedCourses}
        showSaved={showSaved} setShowSaved={setShowSaved}
      />

      {error && <div className="text-red-600 mb-4 font-bold">Hata: {error}</div>}

      <CourseGrid
        groupCourses={groupCourses}
        openDropdownId={openDropdownId}
        setOpenDropdownId={setOpenDropdownId}
        toggleCourse={toggleCourse}
        isSaved={isSaved}
      />
    </div>
  );
}