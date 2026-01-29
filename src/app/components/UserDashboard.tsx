import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useData, Question } from '@/app/contexts/DataContext';
import { Shield, LogOut, CheckCircle, FileQuestion } from 'lucide-react';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { questions, submitAnswer, getUserAnswers } = useData();
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(new Set());

  const userAnswers = user ? getUserAnswers(user.id) : [];

  const handleAnswerChange = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = (questionId: string) => {
    const answer = selectedAnswers[questionId];
    if (answer) {
      submitAnswer(questionId, answer);
      setSubmittedQuestions((prev) => new Set(prev).add(questionId));
      // Clear the answer
      setSelectedAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      });
    }
  };

  const isQuestionAnswered = (questionId: string) => {
    return userAnswers.some((a) => a.questionId === questionId) || submittedQuestions.has(questionId);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">XCyber</h1>
            <p className="text-xs text-blue-300">User Portal</p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg">
            <FileQuestion className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Questions</span>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-700 rounded-lg p-4 mb-4">
            <p className="text-xs text-slate-400 mb-1">Logged in as</p>
            <p className="text-white font-medium">{user?.username}</p>
            <p className="text-xs text-blue-300">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Available Questions</h2>
            <p className="text-slate-400">Answer the questions below and submit your responses</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <p className="text-slate-400 text-sm mb-2">Total Questions</p>
              <p className="text-3xl font-bold text-white">{questions.length}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <p className="text-slate-400 text-sm mb-2">Answered</p>
              <p className="text-3xl font-bold text-green-400">{userAnswers.length}</p>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {questions.length === 0 ? (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
                <p className="text-slate-400">No questions available yet. Check back later!</p>
              </div>
            ) : (
              questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  selectedAnswer={selectedAnswers[question.id] || ''}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                  isAnswered={isQuestionAnswered(question.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuestionCardProps {
  question: Question;
  index: number;
  selectedAnswer: string;
  onAnswerChange: (questionId: string, answer: string) => void;
  onSubmit: (questionId: string) => void;
  isAnswered: boolean;
}

function QuestionCard({
  question,
  index,
  selectedAnswer,
  onAnswerChange,
  onSubmit,
  isAnswered,
}: QuestionCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-semibold text-sm">
              {index + 1}
            </span>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                question.questionType === 'MCQ'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-green-500/20 text-green-300'
              }`}
            >
              {question.questionType === 'MCQ' ? 'Multiple Choice' : 'Fill in the Blank'}
            </span>
          </div>
          <p className="text-lg text-white">{question.questionText}</p>
        </div>
        {isAnswered && (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Submitted</span>
          </div>
        )}
      </div>

      {/* Answer Options/Input */}
      {!isAnswered && (
        <>
          {question.questionType === 'MCQ' && question.options ? (
            <div className="space-y-3 mb-4">
              {Object.entries(question.options).map(([key, value]) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAnswer === key
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={key}
                    checked={selectedAnswer === key}
                    onChange={(e) => onAnswerChange(question.id, e.target.value)}
                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-white font-medium">{key}.</span>
                  <span className="text-slate-300">{value}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="mb-4">
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <button
            onClick={() => onSubmit(question.id)}
            disabled={!selectedAnswer}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        </>
      )}

      {isAnswered && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-300 text-sm">
            ✓ Your answer has been submitted successfully!
          </p>
        </div>
      )}
    </div>
  );
}
