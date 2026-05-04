import { User } from "../models/user.model.js";
import { generateInterviewQuestions } from "../services/questionGeneration.service.js";

export const generateQuestionsController = async (req, res) => {
  try {
    const {
      position,
      company,
      links,
      interviewType,
      difficulty,
      description,
      questionCount,
    } = req.body;

    // Validate request body
    if (!position) {
      return res.status(400).json({ success: false, message: "Position is required." });
    }
    if (!interviewType) {
      return res.status(400).json({ success: false, message: "Interview type is required." });
    }
    if (!difficulty) {
      return res.status(400).json({ success: false, message: "Difficulty is required." });
    }
    if (!description) {
      return res.status(400).json({ success: false, message: "Description is required." });
    }
    if (!questionCount || questionCount < 1 || questionCount > 15) {
      return res
        .status(400)
        .json({ success: false, message: "Question count must be between 1 and 15." });
    }

    // Get user from database to ensure we have the latest CV info
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const result = await generateInterviewQuestions({
      user,
      position,
      company,
      links: Array.isArray(links) ? links : [],
      interviewType,
      difficulty,
      description,
      questionCount,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Generate Questions Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while generating questions.",
    });
  }
};
