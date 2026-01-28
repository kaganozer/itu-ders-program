"use client";
import { useMemo, useState } from "react";
import { compareTimes } from "../utils/helpers";
import Header from "../components/Header";
import Footer from "@/components/Footer";
import CourseGrid from "../components/CourseGrid";

import dbData from "../data/courses.json";
import SideBar from "@/components/SideBar";

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
    <div className="min-h-screen bg-white text-black py-8 px-[5rem] font-sans">
      <Header
        crnFilter={crnFilter} setCrnFilter={setCrnFilter}
        branchCode={branchCodeFilter} setBranchCode={setBranchCodeFilter}
        courseCodeFilter={courseCodeFilter} setCourseCodeFilter={setCourseCodeFilter}
        courseTitleFilter={courseTitleFilter} setCourseTitleFilter={setCourseTitleFilter}
        instructorFilter={instructorFilter} setInstructorFilter={setInstructorFilter}
        handleFilter={handleFilter}
        showSaved={showSaved}
        allOptions={{
          crns: [...new Set(dbData.courses.map(course => course.crn))],
          branchCodes: [...new Set(dbData.courses.map(course => course.branchCode))],
          courseCodes: [...new Set(dbData.courses.map(course => course.courseCode))],
          courseTitles: [...new Set(dbData.courses.map(course => course.courseTitle))],
          instructors: [...new Set(dbData.courses.map(course => course.instructor))],
        }}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Takvim */}
        <CourseGrid
          groupCourses={groupCourses}
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
          toggleCourse={toggleCourse}
          isSaved={isSaved}
        />

        {/* Program Paneli */}
        <SideBar
          savedCourses={savedCourses} setSavedCourses={setSavedCourses}
          showSaved={showSaved} setShowSaved={setShowSaved}
          toggleCourse={toggleCourse}
        />
      </div>

      <Footer />

    </div>
  );
}