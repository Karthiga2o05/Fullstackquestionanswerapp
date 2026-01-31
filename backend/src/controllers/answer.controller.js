import Answer from '../models/Answer.js';
import Question from '../models/Question.js';

/**
 * @desc    Submit an answer
 * @route   POST /api/answers
 * @access  Private (User)
 */
export const submitAnswer = async (req, res) => {
  try {
    const { sectionId, questionId, answerText } = req.body;

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
      sectionId,
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
 * @desc    Get current user's answers
 * @route   GET /api/answers/user
 * @access  Private (User)
 */
export const getUserAnswers = async (req, res) => {
  try {
    const answers = await Answer.find({ userId: req.user._id })
      .populate('questionId', 'questionText questionType')
      .populate('sectionId', 'sectionName')
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
 * @desc    Get user's answers by section
 * @route   GET /api/answers/section/:sectionId
 * @access  Private (User)
 */
export const getUserAnswersBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const answers = await Answer.find({ 
      userId: req.user._id,
      sectionId 
    })
      .populate('questionId', 'questionText questionType correctAnswer')
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
