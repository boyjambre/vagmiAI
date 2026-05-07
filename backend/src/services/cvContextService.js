import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const getCvContext = async (user) => {
  if (!user || !user.cv || !user.cv.filename) {
    return "No CV provided.";
  }

  try {
    const uploadDir =
      process.env.UPLOAD_PATH || path.resolve(process.cwd(), "../shared_data/cv");
    const cvPath = path.join(uploadDir, user.cv.filename);

    if (!fs.existsSync(cvPath)) {
      console.warn(`CV file not found at path: ${cvPath}`);
      return "CV file missing.";
    }

    // Only process PDF for now
    if (!user.cv.filename.toLowerCase().endsWith(".pdf")) {
      return "CV is not a PDF. Skipping text extraction.";
    }

    const dataBuffer = fs.readFileSync(cvPath);
    const data = await pdfParse(dataBuffer);

    // Limit length to avoid huge token costs
    const text = data.text.replace(/\s+/g, " ").trim();
    const maxTokensRoughly = 2000;
    const charLimit = maxTokensRoughly * 4;

    const truncatedText =
      text.length > charLimit ? text.substring(0, charLimit) + "..." : text;

    return `Extracted CV Text:\n${truncatedText}`;
  } catch (error) {
    console.error("Failed to extract CV context:", error.message);
    return "Failed to extract CV context.";
  }
};
