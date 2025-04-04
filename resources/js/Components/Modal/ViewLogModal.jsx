import IRTChart from "../Chart/IRTChart";
import PieChart from "../Chart/PieGraphChart";


export default function ViewLogModal({ log }) {
    const question = log.question_data;
    const total = question.incorrect_count + question.correct_count;
    return (
        <>
            <div className="modal-body">
                <div className="d-flex flex-column p-3">
                    <div className="pe-2">
                        <h6 className="text-center text-lg font-semibold mb-2">IRT ICC Comparison</h6>
                        <IRTChart
                            difficulty={log.new_difficulty_value}
                            difficultyPrev={log.previous_difficulty_value}
                            discrimination={log.new_discrimination_index}
                            discriminationPrev={log.previous_discrimination_index}
                        />
                    </div>
                    {/* <label htmlFor="">Question:</label> */}
                    {/* {question?.choices && (
                        Array.isArray(question.choices) ? (
                            <ol type="a">
                                {question.choices.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ol>
                        ) : (
                            <p>{question.choices}</p>
                        )
                    )} */}
                    {/* {Array.isArray(question.answer) ? (
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
                    )} */}
                    <br />
                    {total > 0 && (
                        <div className="justify-center text-center">
                            <PieChart
                                correctCount={question.correct_count}
                                incorrectCount={question.incorrect_count}
                            />
                        </div>

                    )}
                    <label htmlFor="">Question:</label>
                    <p className="fw-medium h6 mb-3 my-1 lh-base">{question.question}</p>
                    <h5 className="mb-2 fw-semibold">Log Details</h5>
                    <div className="d-grid mb-2 grid-2">
                        <div className="px-3 py-2 bg-light rounded">
                            <label className="text-secondary" style={{ fontSize: '.8rem' }}>Question Type</label>
                            <p className="m-0">{question.question_type}</p>
                        </div>
                        <div className="px-3 py-2 bg-light rounded">
                            <label className="text-secondary" style={{ fontSize: '.8rem' }}>Difficulty</label>
                            {/* <p className="m-0">{question.difficulty_type}</p> */}
                            {log.new_difficulty_type === log.previous_difficulty_type ? (
                                <p className="fw-medium">{question.question_type}</p>
                            ) : (
                                <div>
                                    <span className="text-danger fw-semibold">{log.previous_difficulty_type}</span>
                                    {" → "}
                                    <span className="text-success fw-semibold">{log.new_difficulty_type}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="d-grid mb-2 grid-2">
                        <div className="px-3 py-2 bg-light rounded">
                            <label className="text-secondary" style={{ fontSize: '.8rem' }}>Difficulty Value</label>
                            {/* <p className="m-0">{question.difficulty_value}</p> */}
                            {log.new_difficulty_value === log.previous_difficulty_value ? (
                                <p className="fw-medium">{question.difficulty_value}</p>
                            ) : (
                                <div>
                                    <span className="text-danger fw-semibold">{log.previous_difficulty_value}</span>
                                    {" → "}
                                    <span className="text-success fw-semibold">{log.new_difficulty_value}</span>
                                </div>
                            )}
                        </div>
                        <div className="px-3 py-2 bg-light rounded">
                            <label className="text-secondary" style={{ fontSize: '.8rem' }}>Discrimination Index</label>
                            {/* <p className="m-0">{question.discrimination_index}</p> */}
                            {log.new_discrimination_index === log.previous_discrimination_index ? (
                                <p className="fw-medium">{question.discrimination_index}</p>
                            ) : (
                                <div>
                                    <span className="text-danger fw-semibold">{log.previous_discrimination_index}</span>
                                    {" → "}
                                    <span className="text-success fw-semibold">{log.new_discrimination_index}</span>
                                </div>
                            )}
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
