import React from "react";
import AbilityEstimateLegend from "@/Components/Student/AbilityEstimateLegend";

const getCardColor = (theta) => {
    if (theta <= -3) return "low";
    if (theta >= 3) return "high";
    return "medium";
};

function AbilityEstimateCards({ courses }) {
    return (
        <div>
            <AbilityEstimateLegend />
            <div className="row mb-4">
                {courses.map((course) => {
                    const scoreClass = getCardColor(course.theta_score);
                    return (
                        <div className="col-md-2 mb-3" key={course.course_id}>
                            <div
                                className={`card course-card border-top-0 border-bottom-0 border-right-0 border-left-3 h-100 card-${scoreClass}`}
                            >
                                <div className="card-body course-card-body">
                                    <h5 className="card-title course-card-title fw">
                                        {course.title}
                                    </h5>
                                    <div className="d-flex align-items-center mt-3">
                                        <span className="me-2">
                                            Ability Score:
                                        </span>
                                        <span
                                            className={`badge badge-course bg-${scoreClass} rounded-pill fs-7`}
                                        >
                                            {course.theta_score.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default AbilityEstimateCards;
