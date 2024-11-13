import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

const QuestionForm = ({ course, onAnswerChange, savedAnswers }) => {
  const questionsData = course.questions || [];

  const renderQuestion = (question) => {
    const questionDetail = question.question_detail || {};

    switch (questionDetail.type) {
      case 'Multiple Choice - Single':
        return (
          <div>
            {JSON.parse(questionDetail.choices).map((choice, index) => (
              <div key={index} className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question_${question.question_id}`}
                  value={choice}
                  checked={savedAnswers[question.question_id] === choice}
                  onChange={(e) => onAnswerChange(question.question_id, e.target.value)}
                />
                <label className="form-check-label">
                  {choice}
                </label>
              </div>
            ))}
          </div>
        );

      case 'Multiple Choice - Many':
        return (
          <div>
            {JSON.parse(questionDetail.choices).map((choice, index) => (
              <div key={index} className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name={`question_${question.question_id}`}
                  value={choice}
                  checked={savedAnswers[question.question_id]?.includes(choice)}
                  onChange={(e) => {
                    const currentAnswers = savedAnswers[question.question_id] || [];
                    const newAnswers = e.target.checked
                      ? [...currentAnswers, choice]
                      : currentAnswers.filter((answer) => answer !== choice);
                    onAnswerChange(question.question_id, newAnswers);
                  }}
                />
                <label className="form-check-label">
                  {choice}
                </label>
              </div>
            ))}
          </div>
        );

      case 'Identification':
        return (
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Type your answer here"
              value={savedAnswers[question.question_id] || ''}
              onChange={(e) => onAnswerChange(question.question_id, e.target.value)}
            />
          </div>
        );

      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div>
      {questionsData.length > 0 ? (
        questionsData.map((question, index) => (
          <div key={question.question_id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Question {index + 1}</h5>
              <p className="card-text">{question.question}</p>
              {renderQuestion(question)}
            </div>
          </div>
        ))
      ) : (
        <p>No questions found for this course.</p>
      )}
    </div>
  );
};

export default QuestionForm;
