import { generateQuestions } from "./openRouterService.js";
import { getTavilyContext } from "./tavilyService.js";
import { getLinksContext } from "./linkContextService.js";
import { getCvContext } from "./cvContextService.js";

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

  // Extract user's self-description if available
  const selfDescription = user?.description || null;

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
- Do not fabricate specific company facts unless supported by provided links or search context.

REQUIRED CV REFERENCES:
- At least ONE question must directly reference a specific skill, project, technology, or experience mentioned in the candidate's CV.
- Example format: "Tell me about the [specific project name] you built using [specific technology]" or "I see you have experience with [X], can you explain..."
- Use exact terminology, project names, and skill names from the CV when formulating these specific questions.

REQUIRED SELF-DESCRIPTION REFERENCES (if available):
- If the candidate provided a self-description, at least ONE question must combine and reference BOTH their CV experience AND their self-described goals, strengths, or motivations.
- Example: "In your self-description you mentioned wanting to grow as a [role], and your CV shows experience with [X]. How does this align?"
- This question can overlap with the CV-specific question if both are available.

QUESTION VARIETY:
- When multiple questions are generated, distribute them across: CV-specific (1+), self-description + CV combined (1+, if self-desc available), role/company-specific, and behavioral questions.`;

  // 3. Build User Prompt
  const prompt = `Please generate ${questionCount} interview questions for the following scenario:

Target Position: ${position}
Company/Organization: ${company || "Not specified"}
Interview Type: ${interviewType}
Difficulty Level: ${difficulty}
Job Description / Focus: ${description}

=== CANDIDATE CV CONTEXT ===
${cvContext}

=== CANDIDATE SELF-DESCRIPTION ===
${selfDescription || "No self-description provided."}

=== PROVIDED LINKS CONTEXT ===
${linksContext || "No provided links context."}

=== WEB SEARCH (TAVILY) CONTEXT ===
${searchContext || "No web search context."}

INSTRUCTIONS FOR QUESTION GENERATION:
1. Review the CV context carefully and identify key projects, technologies, and experiences.
2. At least one question MUST directly mention or reference specific content from the CV (e.g., "Tell me about your experience building the X project").
3. ${selfDescription ? "Since a self-description was provided, at least one question must connect their CV experience with their stated goals/motivations from the self-description." : ""}
4. Use the exact names of projects, technologies, and skills as they appear in the CV.
5. Make questions feel personalized - the candidate should feel you actually read their CV.`;

  // 4. Generate Questions via OpenRouter
  const result = await generateQuestions(prompt, systemPrompt);

  return {
    questions: result.questions,
    contextSummary: {
      cv: cvContext ? "Available" : "Not Available",
      selfDescription: selfDescription ? "Available" : "Not Available",
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
