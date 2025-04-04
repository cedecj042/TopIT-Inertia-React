import PieChart from "../Chart/PieGraphChart";


export default function ViewQuestionModal({ question }) {
    const total = question.incorrect_count + question.correct_count;
    return (
        <>
            <div className="modal-body">
                <div className="d-flex flex-column p-3">
                    {/* <label htmlFor="">Question:</label> */}
                    <h5 className="fw-medium mb-3">{question.question}</h5>
                    {question?.choices && (
                        Array.isArray(question.choices) ? (
                            <ol type="a">
                                {question.choices.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ol>
                        ) : (
                            <p>{question.choices}</p>
                        )
                    )}
                    {Array.isArray(question.answer) ? (
                        <>
                            <label htmlFor="">Answer</label>
                            <ul style={{ listStyleType: "none" }} className="p-0 d-inline-flex gap-2">
                                {question.answer.map((item, index) => (
                                    // <li key={index}>{item}</li>
                                    <li className="px-3 py-2 bg-light bg-gradient rounded mb-2" key={index}>
                                        <p className="m-0">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <div className="px-3 py-2 bg-light bg-gradient rounded mb-2">
                            <label className="text-secondary" style={{ fontSize: '.8rem' }}>Answer</label>
                            <p className="m-0">{question.answer}</p>
                        </div>
                    )}
                    <h5 className="mb-2 fw-semibold">Details</h5>
                    {total > 0 && (
                        <div className="justify-center text-center">
                            <PieChart
                                correctCount={question.correct_count}
                                incorrectCount={question.incorrect_count}
                            />
                        </div>

                    )}
                    <div className="d-grid mb-2 grid-2">
                        <div className="px-3 py-2 bg-light rounded">
                            <label className="text-secondary" style={{ fontSize: '.8rem' }}>Question Type</label>
                            <p className="m-0">{question.question_type}</p>
                        </div>
                        <div className="px-3 py-2 bg-light rounded">
                            <label className="text-secondary" style={{ fontSize: '.8rem' }}>Test Type</label>
                            <p className="m-0">{question.test_type}</p>
                        </div>
                    </div>

                    <div className="d-grid mb-2 grid-3">

                        <div className="px-3 py-2 bg-light rounded">
                            <label className="text-secondary" style={{ fontSize: '.8rem' }}>Difficulty</label>
                            <p className="m-0">{question.difficulty_type}</p>
                        </div>
                        <div className="px-3 py-2 bg-light rounded">
                            <label className="text-secondary" style={{ fontSize: '.8rem' }}>Difficulty Value</label>
                            <p className="m-0">{question.difficulty_value}</p>
                        </div>
                        <div className="px-3 py-2 bg-light rounded">
                            <label className="text-secondary" style={{ fontSize: '.8rem' }}>Discrimination Index</label>
                            <p className="m-0">{question.discrimination_index}</p>
                        </div>
                    </div>
                    <div className="px-3 py-2 bg-light rounded">
                        <label className="text-secondary" style={{ fontSize: '.8rem' }}>Course</label>
                        <p className="m-0">{question.course.title}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
