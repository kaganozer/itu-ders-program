"use client";
import { useMemo, useState } from "react";
import Header from "../components/Header";
import CourseGrid from "../components/CourseGrid";
import { compareTimes } from "../utils/helpers";

import dbData from "../data/courses.json";

export default function Home() {
  const [branchList] = useState(dbData.branches.map(code => ({ code })));

  const [crnFilter, setCrnFilter] = useState("");
  const [branchCodeFilter, setBranchCodeFilter] = useState("");
  const [courseCodeFilter, setCourseCodeFilter] = useState("");
  const [courseTitleFilter, setCourseTitleFilter] = useState("");
  const [instructorFilter, setInstructorFilter] = useState("");

  const [scheduleData, setScheduleData] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  const handleFilter = () => {
    setOpenDropdownId(null);

    const filters = {
      branch: branchCodeFilter,
      crn: crnFilter.trim(),
      branchCode: branchCodeFilter.trim().toUpperCase(),
      courseCode: courseCodeFilter.trim().toUpperCase(),
      title: courseTitleFilter.trim().toLocaleUpperCase("tr-TR"),
      instructor: instructorFilter.trim().toLocaleUpperCase("tr-TR")
    };
    const filtered = dbData.courses.filter(course => {
      if (filters.crn && course.crn !== filters.crn) return false;
      if (filters.branchCode && course.branchCode !== filters.branchCode) return false;
      if (filters.courseCode && course.courseCode !== filters.courseCode) return false;
      if (filters.title && !course.courseTitle.toLocaleUpperCase("tr-TR").includes(filters.title)) return false;
      if (filters.instructor && !course.instructor.toLocaleUpperCase("tr-TR").includes(filters.instructor)) return false;
      return true;
    });
    setScheduleData(filtered);
  }

  const toggleCourse = (course) => {
    setSavedCourses((prev) => {
      const exists = prev.find((c) => c.crn === course.crn);
      return exists
        ? prev.filter((c) => c.crn !== course.crn)
        : [...prev, ...dbData.courses.filter(c => c.crn === course.crn)];
    });
  };

  const isSaved = (crn) => savedCourses.some((c) => c.crn === crn);

  const activeData = showSaved ? savedCourses : scheduleData;

  const groupCourses = useMemo(() => {
    const groups = {};
    activeData.forEach(course => {
      const key = `${course.day}-${course.startTime}`;
      if (!groups[key]) {
        groups[key] = {
          key,
          day: course.day,
          startTime: course.startTime,
          endTime: course.endTime,
          courses: []
        };
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
        branchList={branchList}
        crnFilter={crnFilter} setCrnFilter={setCrnFilter}
        branchCode={branchCodeFilter} setBranchCode={setBranchCodeFilter}
        courseCodeFilter={courseCodeFilter} setCourseCodeFilter={setCourseCodeFilter}
        courseTitleFilter={courseTitleFilter} setCourseTitleFilter={setCourseTitleFilter}
        instructorFilter={instructorFilter} setInstructorFilter={setInstructorFilter}
        handleFilter={handleFilter}
        savedCourses={savedCourses} setSavedCourses={setSavedCourses}
        showSaved={showSaved} setShowSaved={setShowSaved}
      />

      <CourseGrid
        groupCourses={groupCourses}
        openDropdownId={openDropdownId}
        setOpenDropdownId={setOpenDropdownId}
        toggleCourse={toggleCourse}
        isSaved={isSaved}
      />

      <div className="fixed bottom-0 left-0 text-[16px] flex justify-between w-full py-3 px-9">
        <a className="text-blue-600 hover:underline" href="https://github.com/kaganozer/">
          Hamza Kağan Özer
        </a>

        <div className="text-gray-900">
          En son {new Date(dbData.lastUpdated).toLocaleString("tr-TR")} tarihinde güncellendi.
        </div>
      </div>
    </div>
  );
}