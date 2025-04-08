import PieChart from "../Chart/PieGraphChart";


export default function ViewQuestionModal({ question }) {

    const total = question.incorrect_count + question.correct_count;

    // const codeRegex = /`([^`]+)`/;
    // const match = question.question.match(codeRegex);

    // const codeSnippet = match ? match[1] : null;
    // const questionText = match
    //     ? question.question.replace(codeRegex, "").trim()
    //     : question.question;
    function preprocessQuestion(raw) {
        return raw
            .replace(/\\`\\`\\`/g, "```")   // Unescape triple backticks
            .replace(/\\t/g, "    ")        // Convert escaped tabs to spaces
            .replace(/```(\w+)? (.*?)```/g, (_, lang, code) => {
                // Handle inline code blocks like ```python print("Hi") ```
                const formatted = code
                    .replace(/(?<!\n)(if|for|while|def|else|elif|print|return|instruction)/g, "\n$1") // crude newline before Python blocks
                    .replace(/\s{2,}/g, " "); // collapse extra spacing
                return `\`\`\`${lang ?? ""}\n${formatted.trim()}\n\`\`\``;
            });
    }
    const cleanedQuestion = preprocessQuestion(question.question);
    const parts = [];
    const blockRegex = /```(?:([\w]+)?\n)?([\s\S]*?)```|((?:^\s*\|.*\|\s*\n?)+)/gm;


    let lastIndex = 0;
    let match;

    while ((match = blockRegex.exec(cleanedQuestion)) !== null) {
        const index = match.index;
        if (index > lastIndex) {
            parts.push({
                type: 'text',
                content: cleanedQuestion.slice(lastIndex, index).trim()
            });
        }
    
        if (match[2]) {
            parts.push({
                type: 'code',
                language: match[1],
                content: match[2].trim()
            });
        } else if (match[3]) {
            parts.push({
                type: 'table',
                content: match[3].trim()
            });
        }
    
        lastIndex = blockRegex.lastIndex;
    }
    
    if (lastIndex < cleanedQuestion.length) {
        parts.push({
            type: 'text',
            content: cleanedQuestion.slice(lastIndex).trim()
        });
    }

    return (
        <>
            <div className="modal-body">
                <div className="d-flex flex-column p-3">
                    {parts.map((part, index) => (
                        part.type === 'text' ? (
                            <h5 key={index} className="mb-3">{part.content}</h5>
                        ) : (
                            <pre key={index} className="bg-dark text-light p-2 rounded">
                                <code lang={part.language}>{part.content}</code>
                            </pre>
                        )
                    ))}
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
