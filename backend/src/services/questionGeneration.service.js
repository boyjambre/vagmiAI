import { generateQuestions } from "./openRouter.service.js";
import { getTavilyContext } from "./tavily.service.js";
import { getLinksContext } from "./linkContext.service.js";
import { getCvContext } from "./cvContext.service.js";

export const generateInterviewQuestions = async ({
  user,
  position,
  company,
  links,
  interviewType,
  difficulty,
  description,
  questionCount,
}) => {
  // 1. Gather Contexts in parallel
  const [cvContext, linksContext, searchContext] = await Promise.all([
    getCvContext(user),
    getLinksContext(links),
    getTavilyContext(position, company, interviewType),
  ]);

  // 2. Build System Prompt
  const systemPrompt = `You are an AI interview question generator. Generate interview questions that are realistic, contextual, and aligned with the candidate's CV, the target role, company context, job description, interview type, and difficulty level.

Return JSON only, without markdown, explanation, or extra text.
The JSON output must strictly follow this schema:
{
  "questions": [
    {
      "id": number,
      "question": "string",
      "category": "string",
      "expectedFocus": "string"
    }
  ]
}

Rules:
- Generate exactly ${questionCount} questions.
- Questions must be written in Indonesian unless the input context strongly indicates English.
- Avoid generic questions when CV, links, or job description provide specific context.
- For HR / Behavioral interviews, focus on motivation, experience, teamwork, conflict, leadership, and career goals.
- For Technical interviews, focus on role-relevant technical skills, project experience, tools, and problem solving.
- For Mixed/General interviews, combine behavioral and technical questions.
- Adjust complexity based on difficulty level (${difficulty}).
- Do not fabricate specific company facts unless supported by provided links or search context.`;

  // 3. Build User Prompt
  const prompt = `Please generate ${questionCount} interview questions for the following scenario:

Target Position: ${position}
Company/Organization: ${company || "Not specified"}
Interview Type: ${interviewType}
Difficulty Level: ${difficulty}
Job Description / Focus: ${description}

=== CANDIDATE CV CONTEXT ===
${cvContext}

=== PROVIDED LINKS CONTEXT ===
${linksContext || "No provided links context."}

=== WEB SEARCH (TAVILY) CONTEXT ===
${searchContext || "No web search context."}`;

  // 4. Generate Questions via OpenRouter
  const result = await generateQuestions(prompt, systemPrompt);

  return {
    questions: result.questions,
    contextSummary: {
      cv: cvContext ? "Available" : "Not Available",
      links: linksContext ? "Available" : "Not Available",
      search: searchContext ? "Available" : "Not Available",
    },
    metadata: {
      model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-v4-flash",
      questionCount,
      interviewType,
      difficulty,
    },
  };
};
