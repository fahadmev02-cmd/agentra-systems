import Groq from "groq-sdk";
import {
  LeadSession,
  buildLeadRequirement,
  languageOptions,
} from "@/lib/voice-agent-config";

export async function generateLeadSummary(session: LeadSession) {
  if (!process.env.GROQ_API_KEY) {
    return [
      session.businessType || "Business type unavailable",
      buildLeadRequirement(session) || "Requirement unavailable",
      session.budget || "Budget not shared",
    ].join(" | ");
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const transcript = session.transcript.join("\n");
  const languageLabel = session.language
    ? languageOptions[session.language].label
    : "Unknown";

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You summarize voice-call leads for an AI automation agency. Extract the business type, main automation need, budget if present, and return a concise sales summary in 2 sentences max.",
        },
        {
          role: "user",
          content: [
            `Language: ${languageLabel}`,
            `Name: ${session.name || "Unknown"}`,
            `Phone: ${session.phoneNumber}`,
            `Business Type: ${session.businessType || "Unknown"}`,
            `Requirement: ${buildLeadRequirement(session) || "Unknown"}`,
            `Budget: ${session.budget || "Unknown"}`,
            `Transcript:\n${transcript}`,
          ].join("\n\n"),
        },
      ],
    });

    return (
      completion.choices[0]?.message?.content?.trim() ||
      "Lead captured. Review transcript for final qualification details."
    );
  } catch {
    return [
      session.businessType || "Business type unavailable",
      buildLeadRequirement(session) || "Requirement unavailable",
      session.budget || "Budget not shared",
    ].join(" | ");
  }
}
