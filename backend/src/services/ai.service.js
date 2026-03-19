import axios from "axios";
import { env } from "../config/env.js";

const aiApi = axios.create({
  baseURL: env.aiServiceUrl,
  timeout: 1000 * 60 * 5,
});

export const getAiHealth = async () => {
  const response = await aiApi.get("/health");
  return response.data;
};

export const sendAsrJob = async (payload) => {
  const response = await aiApi.post("/jobs/asr/process", payload);
  return response.data;
};

export const sendFemJob = async (payload) => {
  const response = await aiApi.post("/jobs/fem/process", payload);
  return response.data;
};