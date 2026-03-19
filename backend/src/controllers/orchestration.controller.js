import {
    getAiHealth,
    sendAsrJob,
    sendFemJob,
  } from "../services/ai.service.js";
  
  export const checkAiHealth = async (req, res) => {
    try {
      const data = await getAiHealth();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to reach AI service",
        error: error.message,
      });
    }
  };
  
  export const processAsrJob = async (req, res) => {
    try {
      const result = await sendAsrJob(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to process ASR job",
        error: error.message,
      });
    }
  };
  
  export const processFemJob = async (req, res) => {
    try {
      const result = await sendFemJob(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to process FEM job",
        error: error.message,
      });
    }
  };