import React from 'react';

const QuestionForm = ({ course, onAnswerChange, savedAnswers }) => {
  // Access the questions array correctly from the course prop
  const questionsData = course.questions || [];

  const renderQuestion = (question) => {
    const questionDetail = question.question_detail || {};

    switch (questionDetail.type) {
      case 'Multiple Choice - Single':
        return (
          <div>
            {JSON.parse(questionDetail.choices).map((choice, index) => (
              <div key={index} className="mb-2">
                <label>
                  <input
                    type="radio"
                    name={`question_${question.question_id}`}
                    value={choice}
                    checked={savedAnswers[question.question_id] === choice}
                    onChange={(e) => onAnswerChange(question.question_id, e.target.value)}
                  />
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
              <div key={index} className="mb-2">
                <label>
                  <input
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
                  {choice}
                </label>
              </div>
            ))}
          </div>
        );

      case 'Identification':
        return (
          <div>
            <input
              type="text"
              className="w-full border p-2 rounded"
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
    <div className="space-y-8">
      {questionsData.length > 0 ? (
        questionsData.map((question, index) => (
          <div key={question.question_id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Question {index + 1}</h3>
              <span className="text-sm text-gray-500">
                {question.question_detail.type.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <p className="mb-4">{question.question}</p>
            {renderQuestion(question)}
          </div>
        ))
      ) : (
        <p>No questions found for this course.</p>
      )}
    </div>
  );
};

export default QuestionForm;
