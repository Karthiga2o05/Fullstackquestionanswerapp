import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Question {
  id: string;
  questionText: string;
  questionType: 'MCQ' | 'FILL_IN_BLANK';
  options?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  createdBy: string;
  createdAt: string;
}

export interface Answer {
  id: string;
  userId: string;
  questionId: string;
  answerText: string;
  submittedAt: string;
}

interface DataContextType {
  questions: Question[];
  answers: Answer[];
  addQuestion: (question: Omit<Question, 'id' | 'createdBy' | 'createdAt'>) => void;
  updateQuestion: (id: string, question: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  submitAnswer: (questionId: string, answerText: string) => void;
  getUserAnswers: (userId: string) => Answer[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const storedQuestions = localStorage.getItem('xcyber_questions');
    const storedAnswers = localStorage.getItem('xcyber_answers');

    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  // Save questions to localStorage
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem('xcyber_questions', JSON.stringify(questions));
    }
  }, [questions]);

  // Save answers to localStorage
  useEffect(() => {
    if (answers.length > 0) {
      localStorage.setItem('xcyber_answers', JSON.stringify(answers));
    }
  }, [answers]);

  const addQuestion = (question: Omit<Question, 'id' | 'createdBy' | 'createdAt'>) => {
    if (!user) return;

    const newQuestion: Question = {
      ...question,
      id: `q_${Date.now()}`,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updatedData: Partial<Question>) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, ...updatedData } : q)));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const submitAnswer = (questionId: string, answerText: string) => {
    if (!user) return;

    const newAnswer: Answer = {
      id: `a_${Date.now()}`,
      userId: user.id,
      questionId,
      answerText,
      submittedAt: new Date().toISOString(),
    };

    setAnswers([...answers, newAnswer]);
  };

  const getUserAnswers = (userId: string) => {
    return answers.filter(a => a.userId === userId);
  };

  return (
    <DataContext.Provider
      value={{
        questions,
        answers,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        submitAnswer,
        getUserAnswers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
