import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { questionAPI, adminAPI, answerAPI } from '@/app/services/api';

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
  loading: boolean;
  addQuestion: (question: Omit<Question, 'id' | 'createdBy' | 'createdAt'>) => Promise<void>;
  updateQuestion: (id: string, question: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  submitAnswer: (questionId: string, answerText: string) => Promise<void>;
  getUserAnswers: (userId: string) => Answer[];
  refreshQuestions: () => Promise<void>;
  refreshAnswers: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);

  // Load questions from API
  const refreshQuestions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await questionAPI.getAll();
      if (response.success) {
        // Map MongoDB _id to id
        const mappedQuestions = response.data.map((q: any) => ({
          id: q._id,
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.options,
          correctAnswer: q.correctAnswer,
          createdBy: q.createdBy,
          createdAt: q.createdAt,
        }));
        setQuestions(mappedQuestions);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load answers from API
  const refreshAnswers = async () => {
    if (!user) return;
    
    try {
      const response = await answerAPI.getMyAnswers();
      if (response.success) {
        // Map MongoDB _id to id
        const mappedAnswers = response.data.map((a: any) => ({
          id: a._id,
          userId: a.userId,
          questionId: a.questionId,
          answerText: a.answerText,
          submittedAt: a.createdAt,
        }));
        setAnswers(mappedAnswers);
      }
    } catch (error) {
      console.error('Error loading answers:', error);
    }
  };

  // Load data when user is authenticated
  useEffect(() => {
    if (user) {
      refreshQuestions();
      refreshAnswers();
    }
  }, [user]);

  const addQuestion = async (question: Omit<Question, 'id' | 'createdBy' | 'createdAt'>) => {
    if (!user) return;

    try {
      const response = await adminAPI.createQuestion({
        questionText: question.questionText,
        questionType: question.questionType,
        options: question.options,
        correctAnswer: question.correctAnswer,
      });

      if (response.success) {
        await refreshQuestions();
      }
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  };

  const updateQuestion = async (id: string, updatedData: Partial<Question>) => {
    try {
      const response = await adminAPI.updateQuestion(id, {
        questionText: updatedData.questionText,
        questionType: updatedData.questionType,
        options: updatedData.options,
        correctAnswer: updatedData.correctAnswer,
      });

      if (response.success) {
        await refreshQuestions();
      }
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      const response = await adminAPI.deleteQuestion(id);

      if (response.success) {
        await refreshQuestions();
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  };

  const submitAnswer = async (questionId: string, answerText: string) => {
    if (!user) return;

    try {
      const response = await answerAPI.submit({ questionId, answerText });

      if (response.success) {
        await refreshAnswers();
      }
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      // Check if it's a duplicate answer error
      if (error.message.includes('already answered')) {
        throw new Error('You have already answered this question');
      }
      throw error;
    }
  };

  const getUserAnswers = (userId: string) => {
    return answers.filter(a => a.userId === userId);
  };

  return (
    <DataContext.Provider
      value={{
        questions,
        answers,
        loading,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        submitAnswer,
        getUserAnswers,
        refreshQuestions,
        refreshAnswers,
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