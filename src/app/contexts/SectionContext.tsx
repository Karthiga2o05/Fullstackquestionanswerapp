import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { sectionAPI, questionAPI, adminAPI, answerAPI } from '@/app/services/api';

export interface Section {
  _id: string;
  sectionName: string;
  createdBy: string;
  createdAt: string;
  questionCount?: number;
}

export interface Question {
  _id: string;
  sectionId: string;
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
  _id: string;
  userId: string;
  sectionId: string;
  questionId: string;
  answerText: string;
  isCorrect: boolean;
  createdAt: string;
}

interface SectionContextType {
  sections: Section[];
  questions: Question[];
  answers: Answer[];
  loading: boolean;
  
  // Section methods
  refreshSections: () => Promise<void>;
  createSection: (sectionName: string) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
  
  // Question methods
  getQuestionsBySection: (sectionId: string) => Promise<void>;
  createQuestion: (questionData: Omit<Question, '_id' | 'createdBy' | 'createdAt'>) => Promise<void>;
  updateQuestion: (id: string, questionData: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  
  // Answer methods
  submitAnswer: (sectionId: string, questionId: string, answerText: string) => Promise<void>;
  refreshAnswers: () => Promise<void>;
  
  // Dashboard stats
  dashboardStats: any;
  refreshDashboardStats: () => Promise<void>;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export function SectionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load sections
  const refreshSections = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const endpoint = user.role === 'ADMIN' ? adminAPI.getSections : sectionAPI.getAll;
      const response = await endpoint();
      
      if (response.success) {
        setSections(response.data);
      }
    } catch (error) {
      console.error('Error loading sections:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create section (admin only)
  const createSection = async (sectionName: string) => {
    try {
      const response = await adminAPI.createSection({ sectionName });
      if (response.success) {
        await refreshSections();
      }
    } catch (error) {
      console.error('Error creating section:', error);
      throw error;
    }
  };

  // Delete section (admin only)
  const deleteSection = async (id: string) => {
    try {
      const response = await adminAPI.deleteSection(id);
      if (response.success) {
        await refreshSections();
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      throw error;
    }
  };

  // Get questions by section
  const getQuestionsBySection = async (sectionId: string) => {
    try {
      setLoading(true);
      const response = await questionAPI.getBySection(sectionId);
      if (response.success) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create question (admin only)
  const createQuestion = async (questionData: Omit<Question, '_id' | 'createdBy' | 'createdAt'>) => {
    try {
      const response = await adminAPI.createQuestion(questionData);
      if (response.success) {
        await refreshSections();
      }
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  };

  // Update question (admin only)
  const updateQuestion = async (id: string, questionData: Partial<Question>) => {
    try {
      const response = await adminAPI.updateQuestion(id, questionData);
      if (response.success) {
        await refreshSections();
      }
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  };

  // Delete question (admin only)
  const deleteQuestion = async (id: string) => {
    try {
      const response = await adminAPI.deleteQuestion(id);
      if (response.success) {
        await refreshSections();
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  };

  // Submit answer (user only)
  const submitAnswer = async (sectionId: string, questionId: string, answerText: string) => {
    try {
      const response = await answerAPI.submit({ sectionId, questionId, answerText });
      if (response.success) {
        await refreshAnswers();
      }
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  };

  // Refresh answers
  const refreshAnswers = async () => {
    if (!user) return;
    
    try {
      const response = await answerAPI.getMyAnswers();
      if (response.success) {
        setAnswers(response.data);
      }
    } catch (error) {
      console.error('Error loading answers:', error);
    }
  };

  // Refresh dashboard stats (admin only)
  const refreshDashboardStats = async () => {
    if (!user || user.role !== 'ADMIN') return;
    
    try {
      const response = await adminAPI.getDashboardStats();
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  // Load data when user is authenticated
  useEffect(() => {
    if (user) {
      refreshSections();
      if (user.role === 'USER') {
        refreshAnswers();
      } else if (user.role === 'ADMIN') {
        refreshDashboardStats();
      }
    }
  }, [user]);

  return (
    <SectionContext.Provider
      value={{
        sections,
        questions,
        answers,
        loading,
        dashboardStats,
        refreshSections,
        createSection,
        deleteSection,
        getQuestionsBySection,
        createQuestion,
        updateQuestion,
        deleteQuestion,
        submitAnswer,
        refreshAnswers,
        refreshDashboardStats,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
}

export function useSections() {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error('useSections must be used within a SectionProvider');
  }
  return context;
}
