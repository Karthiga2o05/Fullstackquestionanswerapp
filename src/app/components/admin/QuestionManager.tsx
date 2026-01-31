import { useState, useEffect } from 'react';
import { useSections } from '@/app/contexts/SectionContext';
import { adminAPI, questionAPI } from '@/app/services/api';
import { Plus, Edit2, Trash2, FileQuestion, Filter } from 'lucide-react';

interface Question {
  _id: string;
  questionText: string;
  questionType: 'MCQ' | 'FILL_IN_BLANK';
  options?: { A: string; B: string; C: string; D: string };
  correctAnswer: string;
  sectionId: string;
  createdAt: string;
}

export default function QuestionManager() {
  const { sections } = useSections();
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<'MCQ' | 'FILL_IN_BLANK'>('MCQ');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  useEffect(() => {
    if (sections.length > 0 && !selectedSection) {
      setSelectedSection(sections[0].id);
    }
  }, [sections]);

  useEffect(() => {
    if (selectedSection) {
      loadQuestions();
    }
  }, [selectedSection]);

  const loadQuestions = async () => {
    if (!selectedSection) return;

    try {
      setLoading(true);
      const response = await questionAPI.getBySectionIdAdmin(selectedSection);
      if (response.success) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setEditingQuestion(null);
    setShowModal(true);
  };

  const openEditModal = (question: Question) => {
    setEditingQuestion(question);
    setQuestionText(question.questionText);
    setQuestionType(question.questionType);
    if (question.questionType === 'MCQ' && question.options) {
      setOptionA(question.options.A);
      setOptionB(question.options.B);
      setOptionC(question.options.C);
      setOptionD(question.options.D);
    }
    setCorrectAnswer(question.correctAnswer);
    setShowModal(true);
  };

  const resetForm = () => {
    setQuestionText('');
    setQuestionType('MCQ');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const questionData = {
      sectionId: selectedSection,
      questionText,
      questionType,
      options: questionType === 'MCQ' ? { A: optionA, B: optionB, C: optionC, D: optionD } : undefined,
      correctAnswer,
    };

    try {
      if (editingQuestion) {
        await adminAPI.updateQuestion(editingQuestion._id, questionData);
      } else {
        await adminAPI.createQuestion(questionData);
      }
      setShowModal(false);
      loadQuestions();
      resetForm();
    } catch (error: any) {
      alert(error.message || 'Failed to save question');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await adminAPI.deleteQuestion(id);
      loadQuestions();
    } catch (error: any) {
      alert(error.message || 'Failed to delete question');
    }
  };

  const selectedSectionName = sections.find((s) => s.id === selectedSection)?.sectionName || '';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Question Management</h1>
          <p className="text-slate-400">Add and manage questions for each section</p>
        </div>
        <button
          onClick={openAddModal}
          disabled={!selectedSection}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Question
        </button>
      </div>

      {/* Section Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">Select Section</label>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full md:w-96 pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="">Select a section</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.sectionName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <FileQuestion className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No questions added yet. Click "Add Question" to create one.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {questions.map((question, index) => (
              <div key={question._id} className="p-6 hover:bg-slate-700/30 transition-colors">
                <div className="flex items-start justify-between">
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
                        {question.questionType === 'MCQ' ? 'Multiple Choice' : 'Fill in Blank'}
                      </span>
                    </div>
                    <p className="text-white text-lg mb-3">{question.questionText}</p>
                    {question.questionType === 'MCQ' && question.options && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-11">
                        {Object.entries(question.options).map(([key, value]) => (
                          <div
                            key={key}
                            className={`p-3 rounded-lg ${
                              key === question.correctAnswer
                                ? 'bg-green-600/20 border border-green-500/30'
                                : 'bg-slate-700/50 border border-slate-600'
                            }`}
                          >
                            <span className="text-slate-300">
                              <span className="font-semibold">{key}.</span> {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {question.questionType === 'FILL_IN_BLANK' && (
                      <div className="ml-11 p-3 bg-green-600/20 border border-green-500/30 rounded-lg inline-block">
                        <span className="text-green-300">
                          <span className="font-semibold">Answer:</span> {question.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(question)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(question._id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-2xl font-bold text-white">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Section: {selectedSectionName}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Question Type</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value as 'MCQ' | 'FILL_IN_BLANK')}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">Correct Answer</label>
                  <input
                    type="text"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter the correct answer"
                    required
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  {editingQuestion ? 'Update Question' : 'Add Question'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
