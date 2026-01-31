import Question from '../models/Question.js';
import Section from '../models/Section.js';

/**
 * @desc    Get all questions by section ID
 * @route   GET /api/questions/:sectionId
 * @access  Private
 */
export const getQuestionsBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    // Verify section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    const questions = await Question.find({ sectionId })
      .select('-__v')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      section: {
        id: section._id,
        name: section.sectionName,
      },
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
