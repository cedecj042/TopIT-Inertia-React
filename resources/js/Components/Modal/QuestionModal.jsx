export default function QuestionModal({ question, onClose }) {
    console.log(question)
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
                        <ol type="a">
                            {question.question_detail.answer.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ol>
                        </>
                    ) : (
                        <div className="px-3 py-2 bg-light bg-gradient rounded mb-2">
                            <label className="text-secondary" style={{ fontSize: '.8rem' }}>Answer</label>
                            <p className="m-0">{question.question_detail.answer}</p>
                        </div>
                        // <p className="fw-semibold">Answer: {question.question_detail.answer}</p>
                    )}
                    <br />
                    <label htmlFor="" className="mb-2">Details</label>
                    <div className="d-grid mb-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                            <div className="px-3 py-2 bg-light rounded">
                                <label className="text-secondary" style={{ fontSize: '.8rem' }}>Type</label>
                                <p className="m-0">{question.question_detail.type}</p>
                            </div>
                            <div className="px-3 py-2 bg-light rounded">
                                <label className="text-secondary" style={{ fontSize: '.8rem' }}>Difficulty</label>
                                <p className="m-0">{question.difficulty.name}</p>
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
