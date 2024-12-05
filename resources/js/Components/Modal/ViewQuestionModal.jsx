export default function ViewQuestionModal({ question }) {

    return (
        <>
            <div className="modal-body">
                <div className="d-flex flex-column p-3">
                    {/* <label htmlFor="">Question:</label> */}
                    <h5 className="fw-semibold">{question.question}</h5>
                    {question.question_detail?.choices && (
                        Array.isArray(question.question_detail.choices) ? (
                            <ol type="a">
                                {question.question_detail.choices.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ol>
                        ) : (
                            <p>{question.question_detail.choices}</p>
                        )
                    )}
                    {Array.isArray(question.question_detail.answer) ? (
                        <>
                        <label htmlFor="">Answer</label>
                        <ul style={{listStyleType:"none"}} className="p-0 d-inline-flex gap-2">
                            {question.question_detail.answer.map((item, index) => (
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
                            <p className="m-0">{question.question_detail.answer}</p>
                        </div>
                        // <p className="fw-semibold">Answer: {question.question_detail.answer}</p>
                    )}
                    <label htmlFor="" className="mb-2">Details</label>
                    <div className="d-grid mb-2 grid-2">
                    <div className="px-3 py-2 bg-light rounded mb-2">
                        <label className="text-secondary" style={{ fontSize: '.8rem' }}>Question Type</label>
                        <p className="m-0">{question.question_detail.type}</p>
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
                        <label className="text-secondary" style={{fontSize:'.8rem'}}>Course</label>
                        <p className="m-0">{question.course.title}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
