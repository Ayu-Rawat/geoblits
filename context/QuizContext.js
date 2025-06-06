import { createContext, useContext } from 'react';

const QuizContext = createContext(null);

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error("useQuizContext must be used within a QuizProvider");
  return context;
};

export const QuizProvider = QuizContext.Provider;
