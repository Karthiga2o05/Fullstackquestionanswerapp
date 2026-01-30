import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import User from '../models/User.js';

/**
 * @desc    Create a new question (Admin only)
 * @route   POST /api/admin/questions
 * @access  Private/Admin
 */
export const createQuestion = async (req, res) => {
  try {
    const { questionText, questionType, options, correctAnswer } = req.body;

    // Validate MCQ has options
    if (questionType === 'MCQ' && (!options || !options.A || !options.B || !options.C || !options.D)) {
      return res.status(400).json({
        success: false,
        message: 'MCQ questions must have all four options (A, B, C, D)',
      });
    }

    const question = await Question.create({
      questionText,
      questionType,
      options: questionType === 'MCQ' ? options : undefined,
      correctAnswer,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating question',
      error: error.message,
    });
  }
};

/**
 * @desc    Update a question (Admin only)
 * @route   PUT /api/admin/questions/:id
 * @access  Private/Admin
 */
export const updateQuestion = async (req, res) => {
  try {
    const { questionText, questionType, options, correctAnswer } = req.body;

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Update fields
    if (questionText) question.questionText = questionText;
    if (questionType) question.questionType = questionType;
    if (correctAnswer) question.correctAnswer = correctAnswer;
    
    if (questionType === 'MCQ' && options) {
      question.options = options;
    } else if (questionType === 'FILL_IN_BLANK') {
      question.options = undefined;
    }

    await question.save();

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating question',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a question (Admin only)
 * @route   DELETE /api/admin/questions/:id
 * @access  Private/Admin
 */
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    await question.deleteOne();

    // Also delete all answers related to this question
    await Answer.deleteMany({ questionId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting question',
      error: error.message,
    });
  }
};

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalAnswers = await Answer.countDocuments();
    const mcqQuestions = await Question.countDocuments({ questionType: 'MCQ' });
    const fillBlankQuestions = await Question.countDocuments({ questionType: 'FILL_IN_BLANK' });

    res.status(200).json({
      success: true,
      data: {
        totalQuestions,
        totalUsers,
        totalAnswers,
        mcqQuestions,
        fillBlankQuestions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message,
    });
  }
};
