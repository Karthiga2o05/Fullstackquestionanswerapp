import Section from '../models/Section.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';

/**
 * @desc    Get all sections (for users)
 * @route   GET /api/sections
 * @access  Private
 */
export const getAllSections = async (req, res) => {
  try {
    const sections = await Section.find()
      .select('-__v')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sections.length,
      data: sections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sections',
      error: error.message,
    });
  }
};

/**
 * @desc    Get section by ID
 * @route   GET /api/sections/:id
 * @access  Private
 */
export const getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).populate('createdBy', 'name email');

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    res.status(200).json({
      success: true,
      data: section,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching section',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new section (Admin only)
 * @route   POST /api/admin/sections
 * @access  Private/Admin
 */
export const createSection = async (req, res) => {
  try {
    const { sectionName } = req.body;

    if (!sectionName) {
      return res.status(400).json({
        success: false,
        message: 'Section name is required',
      });
    }

    const section = await Section.create({
      sectionName,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Section created successfully',
      data: section,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating section',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a section (Admin only)
 * @route   DELETE /api/admin/sections/:id
 * @access  Private/Admin
 */
export const deleteSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    // Delete all questions in this section
    await Question.deleteMany({ sectionId: req.params.id });

    // Delete all answers related to this section
    await Answer.deleteMany({ sectionId: req.params.id });

    await section.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Section and related data deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting section',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all sections with question count (Admin only)
 * @route   GET /api/admin/sections
 * @access  Private/Admin
 */
export const getAdminSections = async (req, res) => {
  try {
    const sections = await Section.find()
      .select('-__v')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Get question count for each section
    const sectionsWithCount = await Promise.all(
      sections.map(async (section) => {
        const questionCount = await Question.countDocuments({ sectionId: section._id });
        return {
          ...section.toObject(),
          questionCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: sectionsWithCount.length,
      data: sectionsWithCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sections',
      error: error.message,
    });
  }
};
