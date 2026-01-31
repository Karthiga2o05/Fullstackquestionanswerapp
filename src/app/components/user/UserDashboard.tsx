import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { useSections } from '@/app/contexts/SectionContext';
import { questionAPI, answerAPI } from '@/app/services/api';
import {
  FolderOpen,
  LogOut,
  Building2,
  FileQuestion,
  CheckCircle,
  Clock,
  Award,
} from 'lucide-react';

interface Question {
  _id: string;
  questionText: string;
  questionType: 'MCQ' | 'FILL_IN_BLANK';
  options?: { A: string; B: string; C: string; D: string };
  sectionId: string;
}

interface Answer {
  _id: string;
  questionId: string;
  answerText: string;
  isCorrect: boolean;
}

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { sections } = useSections();
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserAnswers();
  }, []);

  const loadUserAnswers = async () => {
    try {
      const response = await answerAPI.getUserAnswers();
      if (response.success) {
        setAnswers(response.data);
        const submitted = new Set(response.data.map((a: Answer) => a.questionId));
        setSubmittedQuestions(submitted);
      }
    } catch (error) {
      console.error('Error loading answers:', error);
    }
  };

  const handleSelectSection = async (section: any) => {
    setSelectedSection(section);
    try {
      setLoading(true);
      const response = await questionAPI.getBySectionId(section.id);
      if (response.success) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitAnswer = async (questionId: string) => {
    const answer = selectedAnswers[questionId];
    if (!answer) {
      alert('Please select or enter an answer');
      return;
    }

    try {
      await answerAPI.submit({
        sectionId: selectedSection.id,
        questionId,
        answerText: answer,
      });
      setSubmittedQuestions((prev) => new Set(prev).add(questionId));
      setSelectedAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      });
      alert('Answer submitted successfully!');
      loadUserAnswers();
    } catch (error: any) {
      alert(error.message || 'Failed to submit answer');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBackToSections = () => {
    setSelectedSection(null);
    setQuestions([]);
  };

  const isQuestionAnswered = (questionId: string) => {
    return submittedQuestions.has(questionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-800/90 backdrop-blur-sm border-r border-slate-700/50 p-6 z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">XCyber</h1>
            <p className="text-xs text-blue-300">Student Portal</p>
          </div>
        </div>

        <nav className="space-y-2 mb-8">
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg">
            <FolderOpen className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Exam Sections</span>
          </div>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
            <p className="text-xs text-slate-400 mb-1">Logged in as</p>
            <p className="text-white font-medium">{user?.name}</p>
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
        <div className="max-w-7xl mx-auto">
          {!selectedSection ? (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Exam Sections</h1>
                <p className="text-slate-400">Select a section to start practicing questions</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-blue-100 text-sm font-medium">Available</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{sections.length}</div>
                  <p className="text-blue-100 text-sm">Exam sections</p>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-100 text-sm font-medium">Completed</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{submittedQuestions.size}</div>
                  <p className="text-green-100 text-sm">Questions answered</p>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-purple-100 text-sm font-medium">Progress</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {answers.filter((a) => a.isCorrect).length}
                  </div>
                  <p className="text-purple-100 text-sm">Correct answers</p>
                </div>
              </div>

              {/* Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSelectSection(section)}
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-700/50 hover:border-blue-500/50 transition-all text-left"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-600/20 rounded-lg">
                        <Building2 className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{section.sectionName}</h3>
                    </div>
                    <p className="text-slate-400 text-sm">Click to view questions</p>
                  </button>
                ))}
              </div>

              {sections.length === 0 && (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
                  <FolderOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No exam sections available yet.</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <button
                    onClick={handleBackToSections}
                    className="text-blue-400 hover:text-blue-300 text-sm mb-2"
                  >
                    ← Back to Sections
                  </button>
                  <h1 className="text-3xl font-bold text-white mb-2">{selectedSection.sectionName}</h1>
                  <p className="text-slate-400">Answer the questions below</p>
                </div>
              </div>

              {loading ? (
                <div className="text-center text-slate-400 py-12">Loading questions...</div>
              ) : questions.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
                  <FileQuestion className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No questions available in this section yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div
                      key={question._id}
                      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-semibold text-sm">
                              {index + 1}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                        {isQuestionAnswered(question._id) && (
                          <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Submitted</span>
                          </div>
                        )}
                      </div>

                      {!isQuestionAnswered(question._id) && (
                        <>
                          {question.questionType === 'MCQ' && question.options ? (
                            <div className="space-y-3 mb-4 ml-11">
                              {Object.entries(question.options).map(([key, value]) => (
                                <label
                                  key={key}
                                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    selectedAnswers[question._id] === key
                                      ? 'border-blue-500 bg-blue-500/10'
                                      : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${question._id}`}
                                    value={key}
                                    checked={selectedAnswers[question._id] === key}
                                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span className="text-white font-medium">{key}.</span>
                                  <span className="text-slate-300">{value}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <div className="mb-4 ml-11">
                              <input
                                type="text"
                                value={selectedAnswers[question._id] || ''}
                                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                placeholder="Type your answer here..."
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          )}

                          <div className="ml-11">
                            <button
                              onClick={() => handleSubmitAnswer(question._id)}
                              disabled={!selectedAnswers[question._id]}
                              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Submit Answer
                            </button>
                          </div>
                        </>
                      )}

                      {isQuestionAnswered(question._id) && (
                        <div className="ml-11 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                          <p className="text-green-300 text-sm">
                            ✓ Your answer has been submitted successfully!
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
