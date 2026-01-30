import Question from '../models/Question.js';

/**
 * @desc    Get all questions (for users)
 * @route   GET /api/questions
 * @access  Private
 */
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .select('-__v')
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message,
    });
  }
};

/**
 * @desc    Get question by ID
 * @route   GET /api/questions/:id
 * @access  Private
 */
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('createdBy', 'username email');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching question',
      error: error.message,
    });
  }
};
