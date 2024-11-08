import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react'; 
import MainLayout from "@/Layouts/MainLayout";
import Sidebar from "@/Components/Pretest/Sidebar";
import QuestionForm from '@/Components/Pretest/QuestionForm';
import "../../../../css/student/students.css";
import "../../../../css/student/welcome.css";

const Pretest = ({ courses, assessment }) => {
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0); // track the current course
  const [answers, setAnswers] = useState({}); // track student answers

  useEffect(() => {
    console.log('Courses data:', courses);
    console.log('Assessment data: ', assessment);
  }, [courses, assessment]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  //temp
  const handleSubmit = () => {
    router.post('/assessment/submit', {
      assessment_id: assessment.assessment_id, 
      answers: answers
    });
  };

  const coursesData = courses.data || [];
  const questionsForCurrentCourse = courses.questions?.[currentCourseIndex]?.questions || []; //getting questions for each course

  console.log('Rendering Pretest component'); 
  console.log('Current course questions:', questionsForCurrentCourse);

  return (
    <>
      <Head title="Pretest" />
      
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar 
          courses={courses} 
          currentCourseIndex={currentCourseIndex} 
          setCurrentCourseIndex={setCurrentCourseIndex} 
          answeredQuestions={answers} 
        />
        
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Pre-Test Assessment</h1>
            
            {questionsForCurrentCourse.length > 0 ? (
              <>
                <QuestionForm
                  course={{ questions: questionsForCurrentCourse }} 
                  onAnswerChange={handleAnswerChange} 
                  savedAnswers={answers} 
                />
              </>
            ) : (
              <p>Loading questions...</p>
            )}
            
            {currentCourseIndex === coursesData.length - 1 && (
              <button
                onClick={handleSubmit}
                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={Object.keys(answers).length === 0}
              >
                Submit All Answers
              </button>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

Pretest.layout = (page) => <MainLayout children={page} />;

export default Pretest;
