import React, { useState, useEffect } from 'react';
import MainLayout from "@/Layouts/MainLayout";
import Navbar from "@/Components/Navigation/Navbar";
import Sidebar from "@/Components/Pretest/Sidebar";
import QuestionForm from "@/Components/Pretest/QuestionForm";
import { Inertia } from '@inertiajs/inertia'; 
import { usePage } from '@inertiajs/react'; 
import "../../../../css/student/students.css";
import "../../../../css/student/pretest.css";

const Pretest = () => {
  const { coursesData, initialQuestions, initialAnswers, initialCourse, currentCourseIndex, totalCourses, isLastCourse } = usePage().props;
  const [courses, setCourses] = useState(coursesData || []);
  const [questions, setQuestions] = useState(initialQuestions);
  const [answers, setAnswers] = useState(initialAnswers);
  const [currentCourse, setCurrentCourse] = useState(initialCourse);

  console.log("Initial Props:", { initialQuestions, coursesData });

  useEffect(() => {
    if (initialQuestions && initialQuestions.length === 0) {
      console.log("Initial questions are empty, fetching questions...");
      fetchQuestions();
    }
  }, [initialQuestions]);

  const fetchQuestions = async (courseIndex = null) => {
    const url = courseIndex !== null ? `/pretest/questions/${courseIndex}` : '/pretest/questions';
    try {
      await Inertia.visit(url, {
        method: 'get',
        onSuccess: (page) => {
          console.log("Fetched Page Props: ", page.props);
          setCourses(page.props.coursesData || []);
          setQuestions(page.props.initialQuestions);
          setCurrentCourse(page.props.initialCourse);
          setAnswers(page.props.initialAnswers);
        },
      });
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const handleCourseSelect = (index) => {
    fetchQuestions(index);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async (action = 'next') => {
    Inertia.post('/pretest/submit', { answers, courseIndex: currentCourseIndex }, {
      onSuccess: (page) => {
        const data = page.props;
        if (data.status === 'finished') {
          Inertia.visit(`/pretest/finish/${data.pretestId}`);
        } else if (action === 'previous') {
          fetchQuestions(currentCourseIndex - 1);
        } else {
          fetchQuestions(currentCourseIndex + 1);
        }
      },
    });
  };

  console.log("Courses Data: ", courses);
  console.log("Questions Data: ", questions);


  return (
    <MainLayout>
      <Navbar isLight={true} />
      <div className="container my-5">
        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h2 className="mb-4">Assessment Test</h2>
            <div className="text-end">
              <h5>{currentCourse?.title}</h5>
              <p>Course {currentCourseIndex + 1} of {totalCourses}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row">
          <div className="col-lg-3">
            <Sidebar
              coursesData={courses}
              currentCourseIndex={currentCourseIndex}
              onCourseSelect={handleCourseSelect}
            />
          </div>
          <div className="col-lg-9">
            <QuestionForm
              questions={questions}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              onSubmit={handleSubmit}
              currentCourseIndex={currentCourseIndex}
              totalCourses={totalCourses}
              isLastCourse={isLastCourse}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pretest;