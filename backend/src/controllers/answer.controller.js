import Answer from '../models/Answer.js';
import Question from '../models/Question.js';

/**
 * @desc    Submit an answer
 * @route   POST /api/answers
 * @access  Private
 */
export const submitAnswer = async (req, res) => {
  try {
    const { questionId, answerText } = req.body;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Check if user already answered this question
    const existingAnswer = await Answer.findOne({
      userId: req.user._id,
      questionId,
    });

    if (existingAnswer) {
      return res.status(400).json({
        success: false,
        message: 'You have already answered this question',
      });
    }

    // Determine if answer is correct
    let isCorrect = false;
    if (question.questionType === 'MCQ') {
      isCorrect = answerText === question.correctAnswer;
    } else {
      // Case-insensitive comparison for fill in the blank
      isCorrect = answerText.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    }

    // Create answer
    const answer = await Answer.create({
      userId: req.user._id,
      questionId,
      answerText,
      isCorrect,
    });

    res.status(201).json({
      success: true,
      message: 'Answer submitted successfully',
      data: answer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting answer',
      error: error.message,
    });
  }
};

/**
 * @desc    Get user's answers
 * @route   GET /api/answers/:userId
 * @access  Private
 */
export const getUserAnswers = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Users can only view their own answers, admins can view anyone's
    if (req.user.role !== 'ADMIN' && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own answers',
      });
    }

    const answers = await Answer.find({ userId })
      .populate('questionId', 'questionText questionType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: answers.length,
      data: answers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching answers',
      error: error.message,
    });
  }
};

/**
 * @desc    Get current user's answers
 * @route   GET /api/answers
 * @access  Private
 */
export const getMyAnswers = async (req, res) => {
  try {
    const answers = await Answer.find({ userId: req.user._id })
      .populate('questionId', 'questionText questionType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: answers.length,
      data: answers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching answers',
      error: error.message,
    });
  }
};
