
import { GoogleGenAI } from "@google/genai";
import { COUNCIL_SYSTEM_PROMPT } from "../constants";
import { 
  CouncilOutput, 
  RisksAndOpportunitiesOutput, 
  ImprovementOutput, 
  SimpleExplanationOutput 
} from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const runCouncilDebate = async (scenario: string, type: string): Promise<CouncilOutput> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Scenario Type: ${type}\nScenario: ${scenario}`,
    config: {
      systemInstruction: COUNCIL_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  try {
    const rawText = response.text || "{}";
    return JSON.parse(rawText) as CouncilOutput;
  } catch (err) {
    console.error("Failed to parse Council output:", err);
    throw new Error("Invalid response from expert panel.");
  }
};

export const getRisksAndOpportunities = async (councilData: CouncilOutput): Promise<RisksAndOpportunitiesOutput> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `From this Sustainability Council JSON, extract:
- TOP 3 RISKS with label, 1-2 sentence description, horizon (short-term/medium-term/long-term)
- TOP 3 OPPORTUNITIES with label, 1-2 sentence description, horizon  
Output valid JSON only: {risks: [{label, description, horizon}], opportunities: [{label, description, horizon}]}
Council JSON: ${JSON.stringify(councilData)}`,
    config: {
      systemInstruction: "You are a risk management expert. Avoid harmful content. No PII. Advisory only.",
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}") as RisksAndOpportunitiesOutput;
};

export const getImprovementPlan = async (councilData: CouncilOutput): Promise<ImprovementOutput> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this Sustainability Council JSON output and propose 3-7 concrete, actionable changes that would improve the Environmental, Social, and Governance/Economic performance of the recommended option. 
For each recommendation, specify which CSR dimension(s) it primarily improves and note any potential trade-offs. 
Output JSON: { intro: string, suggestions: [{text: string, dimensions: string[], trade_offs: string}] }
Council JSON: ${JSON.stringify(councilData)}`,
    config: {
      systemInstruction: "You are a sustainability consultant. Output clean JSON only. Advisory only.",
      responseMimeType: "application/json",
    },
  });
  return JSON.parse(response.text || "{}") as ImprovementOutput;
};

export const getSimpleExplanation = async (councilData: CouncilOutput): Promise<SimpleExplanationOutput> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Convert this Sustainability Council JSON into 3-4 short paragraphs of plain-language explanation for non-technical stakeholders. Cover the scenario, key CSR findings, options, and recommendation. Add one extra paragraph tailored for a specific role (mayor, campus officer, ESG manager) explaining what this means for them. Output plain text JSON format only.
Output JSON: { explanation: string, role_based_summary: string }
Council JSON: ${JSON.stringify(councilData)}`,
    config: {
      systemInstruction: "Conversational tone, no jargon. Output JSON only.",
      responseMimeType: "application/json",
    },
  });
  return JSON.parse(response.text || "{}") as SimpleExplanationOutput;
};

export const getOnePageReport = async (councilData: CouncilOutput): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a one-page CSR report from this Sustainability Council JSON. 
Output PLAIN TEXT ONLY (no JSON, no markdown) with these EXACT sections and headings in order:

Sustainability Council Report: [6-10 word scenario title]

1. Scenario overview
[3-5 sentences]

2. Key perspectives from the council
[3-6 lines: 'Climate Scientist: ...']

3. CSR assessment (Environmental, Social, Governance/Economic)
[1 paragraph]

4. Options considered
[2-3 sentences per option]

5. Recommended option and next steps
[3-5 sentences]

Keep concise, professional tone for governance/stakeholder use.
Council JSON: ${JSON.stringify(councilData)}`,
    config: {
      systemInstruction: "Return plain text ONLY. No markdown. No JSON.",
    },
  });
  return response.text || "Report generation failed.";
};

export const getScenarioCoach = async (scenario: string): Promise<string[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Review this scenario: "${scenario}". Suggest what might be missing to make it a better CSR proposal (max 3 items).`,
    config: {
      systemInstruction: "Output JSON: { suggestions: [string] }",
      responseMimeType: "application/json",
    },
  });
  const data = JSON.parse(response.text || "{}");
  return data.suggestions || [];
};

export const chatWithAssistant = async (query: string, currentContext?: CouncilOutput): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `User Query: ${query}\nContext: ${JSON.stringify(currentContext || "None")}`,
    config: {
      systemInstruction: "You are the Council Assistant. Help users phrase scenarios, explain CSR concepts, and summarize findings. Be succinct.",
    },
  });
  return response.text || "I'm sorry, I couldn't process that.";
};
