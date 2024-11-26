import { createContext, useContext, useState } from "react";

const SelectedQuestionsContext = createContext();

export const SelectedQuestionsProvider = ({ children }) => {
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    return (
        <SelectedQuestionsContext.Provider value={{ selectedQuestions, setSelectedQuestions }}>
            {children}
        </SelectedQuestionsContext.Provider>
    );
};

export const useSelectedQuestions = () => useContext(SelectedQuestionsContext);
