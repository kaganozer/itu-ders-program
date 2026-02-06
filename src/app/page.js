"use client";
import { useMemo, useRef, useState, useCallback } from "react";
import { compareTimes } from "../utils/helpers";
import Header from "../components/Header";
import Footer from "@/components/Footer";
import CourseGrid from "../components/CourseGrid";

import dbData from "../data/courses.json";
import SideBar from "@/components/SideBar";

export default function Home() {
  const [crnFilter, setCrnFilter] = useState("");
  const [branchCodeFilter, setBranchCodeFilter] = useState("");
  const [courseCodeFilter, setCourseCodeFilter] = useState("");
  const [courseTitleFilter, setCourseTitleFilter] = useState("");
  const [instructorFilter, setInstructorFilter] = useState("");

  const [scheduleData, setScheduleData] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  const calendarRef = useRef(null);
  const headerRef = useRef(null);

  const scrollToCalendar = () => {
    calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const scrollToHeader = () => {
    headerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const savedCRNs = useMemo(() => new Set(savedCourses.map(c => c.crn)), [savedCourses]);

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

    setShowSaved(false);
    scrollToCalendar();
  }

  const toggleCourse = useCallback((course) => {
    setSavedCourses((prev) => {
      const exists = prev.find((c) => c.crn === course.crn);
      return exists
        ? prev.filter((c) => c.crn !== course.crn)
        : [...prev, ...dbData.courses.filter(c => c.crn === course.crn)];
    });
  }, []);

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

  const allOptions = useMemo(() => {
    const sets = {
      crns: new Set(),
      branchCodes: new Set(),
      courseCodes: new Set(),
      courseTitles: new Set(),
      instructors: new Set()
    };

    dbData.courses.forEach(course => {
      sets.crns.add(course.crn);
      sets.branchCodes.add(course.branchCode);
      sets.courseCodes.add(course.courseCode);
      sets.courseTitles.add(course.courseTitle);
      sets.instructors.add(course.instructor);
    });

    return {
      crns: [...sets.crns],
      branchCodes: [...sets.branchCodes],
      courseCodes: [...sets.courseCodes],
      courseTitles: [...sets.courseTitles],
      instructors: [...sets.instructors]
    };
  }, []);


  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-6 lg:px-12 lg:py-8 font-sans">
      <div ref={headerRef}>
        <Header
          crnFilter={crnFilter} setCrnFilter={setCrnFilter}
          branchCode={branchCodeFilter} setBranchCode={setBranchCodeFilter}
          courseCodeFilter={courseCodeFilter} setCourseCodeFilter={setCourseCodeFilter}
          courseTitleFilter={courseTitleFilter} setCourseTitleFilter={setCourseTitleFilter}
          instructorFilter={instructorFilter} setInstructorFilter={setInstructorFilter}
          handleFilter={handleFilter}
          showSaved={showSaved}
          allOptions={allOptions}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start scroll-mt-8" ref={calendarRef}>
        {/* Takvim */}
        <CourseGrid
          groupCourses={groupCourses}
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
          toggleCourse={toggleCourse}
          savedCRNs={savedCRNs}
        />

        {/* Program Paneli */}
        <SideBar
          savedCourses={savedCourses} setSavedCourses={setSavedCourses}
          showSaved={showSaved} setShowSaved={setShowSaved}
          toggleCourse={toggleCourse}
          onScrollToCalendar={scrollToCalendar}
          onScrollToHeader={scrollToHeader}
        />
      </div>

      <Footer />
    </div>
  );
}