// src/components/Student/AssessmentDetailsModal.jsx (adjust path as needed)
import React from 'react';
import PropTypes from 'prop-types';
import ThetaScoreChart from '../Chart/ThetaScoreChart';

// Helper function to determine badge class based on score
const getScoreBadgeClass = (score) => {
    return score > 0 ? 'badge bg-success-subtle text-success-emphasis' : 'badge bg-danger-subtle text-danger-emphasis';
};

// Helper function to display participant answer nicely (handle potential null/empty)
const formatParticipantAnswer = (answer) => {
    if (answer === null || answer === undefined || answer === '') {
        return <span className="text-muted fst-italic">No Answer</span>;
    }
    // Basic check if answer might be HTML (very simplistic)
    if (typeof answer === 'string' && answer.includes('<') && answer.includes('>')) {
        // Be cautious with dangerouslySetInnerHTML - ensure your backend sanitizes HTML if applicable
        return <span dangerouslySetInnerHTML={{ __html: answer }} />;
    }
    return <span>{String(answer)}</span>;
};

export default function AssessmentDetailsModal({ test }) {
    if (!test) {
        return (
            <div className="alert alert-warning" role="alert">
                No assessment data selected.
            </div>
        );
    }
    const {
        assessment_id,
        student_id,
        start_time,
        end_time,
        type,
        total_items,
        total_score,
        percentage,
        status,
        created_at,
        assessment_courses = [], 
    } = test;
    const coursesAccordionId = `coursesAccordion-${assessment_id}`;
    return (
        <div className="modal-body px-4 py-3">
            {/* Overall Summary Section */}
            <div className="mb-4 p-3 bg-light rounded border">
                <h5 className="mb-3">Overall Summary</h5>
                <div className="row g-3">
                    <div className="col-md-6 col-lg-4">
                        <strong>Assessment ID:</strong> {assessment_id}
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <strong>Student ID:</strong> {student_id}
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <strong>Date Taken:</strong> {created_at}
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <strong>Time:</strong> {start_time} - {end_time}
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <strong>Type:</strong> <span className="badge bg-secondary">{type}</span>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <strong>Status:</strong> <span className={`badge ${status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>{status ?? 'N/A'}</span>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <strong>Overall Score:</strong> {total_score} / {total_items}
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <strong>Overall Percentage:</strong> {Math.round(percentage)}%
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <h5 className="mb-3">Course Breakdown</h5>
                {assessment_courses.length > 0 ? (
                    <div className="accordion" id={coursesAccordionId}>
                        {assessment_courses.map((ac, courseIndex) => {
                            const collapseCourseId = `collapseCourse-${ac.assessment_course_id || courseIndex}`;
                            const headerCourseId = `headerCourse-${ac.assessment_course_id || courseIndex}`;

                            return (
                                <div className="accordion-item" key={ac.assessment_course_id || courseIndex}>
                                    <h2 className="accordion-header" id={headerCourseId}>
                                        <button
                                            className="accordion-button collapsed px-3 py-1" // Start collapsed
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#${collapseCourseId}`}
                                            aria-expanded="false" 
                                            aria-controls={collapseCourseId}
                                        >
                                            <span className="flex-grow-1 me-3 fw-semibsold">
                                                {ac.course?.title || `Course ID: ${ac.course_id}`}
                                            </span>
                                            <span className="me-3">
                                                Score: <strong>{ac.total_score} / {ac.total_items}</strong>
                                            </span>
                                            {ac.theta_score !== null && ac.theta_score !== undefined && (
                                                <span className="badge bg-info-subtle text-info-emphasis">
                                                    Theta: {Number(ac.theta_score).toFixed(3)}
                                                </span>
                                            )}
                                        </button>
                                    </h2>
                                    <div
                                        id={collapseCourseId}
                                        className="accordion-collapse collapse"
                                        aria-labelledby={headerCourseId}
                                        data-bs-parent={`#${coursesAccordionId}`}
                                    >
                                        <div className="accordion-body">
                                            {ac.assessment_items && ac.assessment_items.length > 0 ? (
                                                <>
                                                    <ul className="list-group list-group-flush">
                                                        {ac.assessment_items.map((item, itemIndex) => (
                                                            <li key={item.assessment_item_id || itemIndex} className="list-group-item px-0 py-3"> {/* Added padding */}
                                                                <div className="row g-2 align-items-start">
                                                                    <div className="col-md-8">
                                                                        <strong>Q{itemIndex + 1}:</strong>
                                                                        <div className="mt-1 ps-2 border-start border-2">
                                                                            {item.question?.question || `Question ID: ${item.question_id}`}
                                                                        </div>
                                                                        {item.question?.answer && (
                                                                            <div className="text-muted small mt-2">
                                                                                <em>Correct Answer:</em>
                                                                                <div className='text-success fw-semibold ps-2'>
                                                                                    {formatParticipantAnswer(item.question.answer)}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="col-md-4 d-flex flex-column align-items-md-end">
                                                                        <div className='mb-1'> {/* Add margin */}
                                                                            <span className='small text-muted'>Answered:</span> {formatParticipantAnswer(item.participant_answer)}
                                                                        </div>
                                                                        <div className="mt-1">
                                                                            <span className={getScoreBadgeClass(item.score)}>
                                                                                Score: {item.score}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            ) : (
                                                <p className="text-muted mb-0">No item details available for this course.</p>
                                            )}

                                            {ac.theta_score_logs && ac.theta_score_logs.length > 0 && (
                                                <div className="mt-3 border-top pt-3">
                                                    <ThetaScoreChart
                                                        logs={ac.theta_score_logs}
                                                        items={ac.assessment_items}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="alert alert-light" role="alert">
                        No course-specific data available for this assessment.
                    </div>
                )}
            </div>
        </div>
    );
}