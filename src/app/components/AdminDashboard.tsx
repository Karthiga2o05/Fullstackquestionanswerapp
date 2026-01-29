import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useData, Question } from '@/app/contexts/DataContext';
import { Shield, Plus, Edit2, Trash2, LogOut, FileQuestion } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(id);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingQuestion(null);
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
            <p className="text-xs text-blue-300">Admin Panel</p>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Question Management</h2>
              <p className="text-slate-400">Manage all questions for the platform</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <p className="text-slate-400 text-sm mb-2">Total Questions</p>
              <p className="text-3xl font-bold text-white">{questions.length}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <p className="text-slate-400 text-sm mb-2">MCQ Questions</p>
              <p className="text-3xl font-bold text-blue-400">
                {questions.filter((q) => q.questionType === 'MCQ').length}
              </p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <p className="text-slate-400 text-sm mb-2">Fill in the Blank</p>
              <p className="text-3xl font-bold text-green-400">
                {questions.filter((q) => q.questionType === 'FILL_IN_BLANK').length}
              </p>
            </div>
          </div>

          {/* Questions Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Correct Answer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {questions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                        No questions added yet. Click "Add Question" to create one.
                      </td>
                    </tr>
                  ) : (
                    questions.map((question) => (
                      <tr key={question.id} className="hover:bg-slate-700/50 transition-colors">
                        <td className="px-6 py-4 text-white max-w-md">
                          <p className="truncate">{question.questionText}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              question.questionType === 'MCQ'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-green-500/20 text-green-300'
                            }`}
                          >
                            {question.questionType === 'MCQ' ? 'MCQ' : 'Fill in Blank'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-300">{question.correctAnswer}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(question)}
                              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(question.id)}
                              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <QuestionModal
          question={editingQuestion}
          onClose={closeModal}
          onSave={(questionData) => {
            if (editingQuestion) {
              updateQuestion(editingQuestion.id, questionData);
            } else {
              addQuestion(questionData);
            }
            closeModal();
          }}
        />
      )}
    </div>
  );
}

interface QuestionModalProps {
  question: Question | null;
  onClose: () => void;
  onSave: (question: Omit<Question, 'id' | 'createdBy' | 'createdAt'>) => void;
}

function QuestionModal({ question, onClose, onSave }: QuestionModalProps) {
  const [questionType, setQuestionType] = useState<'MCQ' | 'FILL_IN_BLANK'>(
    question?.questionType || 'MCQ'
  );
  const [questionText, setQuestionText] = useState(question?.questionText || '');
  const [optionA, setOptionA] = useState(question?.options?.A || '');
  const [optionB, setOptionB] = useState(question?.options?.B || '');
  const [optionC, setOptionC] = useState(question?.options?.C || '');
  const [optionD, setOptionD] = useState(question?.options?.D || '');
  const [correctAnswer, setCorrectAnswer] = useState(question?.correctAnswer || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const questionData: Omit<Question, 'id' | 'createdBy' | 'createdAt'> = {
      questionText,
      questionType,
      correctAnswer,
      ...(questionType === 'MCQ' && {
        options: {
          A: optionA,
          B: optionB,
          C: optionC,
          D: optionD,
        },
      }),
    };

    onSave(questionData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-2xl font-bold text-white">
            {question ? 'Edit Question' : 'Add New Question'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Question Type</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as 'MCQ' | 'FILL_IN_BLANK')}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MCQ">Multiple Choice Question (MCQ)</option>
              <option value="FILL_IN_BLANK">Fill in the Blank</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Question Text</label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your question"
              rows={3}
              required
            />
          </div>

          {questionType === 'MCQ' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Option A</label>
                <input
                  type="text"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter option A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Option B</label>
                <input
                  type="text"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter option B"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Option C</label>
                <input
                  type="text"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter option C"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Option D</label>
                <input
                  type="text"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter option D"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Correct Answer (A, B, C, or D)
                </label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select correct answer</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>
          )}

          {questionType === 'FILL_IN_BLANK' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Correct Answer
              </label>
              <input
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the correct answer"
                required
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {question ? 'Update Question' : 'Add Question'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
