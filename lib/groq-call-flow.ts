import Groq from "groq-sdk";
import {
  LeadLanguage,
  LeadSession,
  languageOptions,
} from "@/lib/voice-agent-config";

const fallbackPrompts: Record<LeadLanguage, string> = {
  english:
    "What is the biggest bottleneck right now: slow replies, missed leads, manual follow-ups, or appointment handling?",
  hindi:
    "Abhi sabse bada bottleneck kya hai: slow replies, missed leads, manual follow-ups, ya appointment handling?",
  hinglish:
    "Abhi sabse bada bottleneck kya hai: slow replies, missed leads, manual follow-ups, ya appointment handling?",
};

function sanitizeQuestion(question: string, language: LeadLanguage) {
  const singleLine = question.replace(/\s+/g, " ").trim();

  if (!singleLine) {
    return fallbackPrompts[language];
  }

  const normalized = singleLine.endsWith("?") ? singleLine : `${singleLine}?`;
  return normalized.slice(0, 220);
}

export async function generateDynamicFollowUpQuestion(session: LeadSession) {
  const language = session.language ?? "english";

  if (!process.env.GROQ_API_KEY) {
    return fallbackPrompts[language];
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You write one short, natural follow-up question for a live sales qualification phone call about AI automation. The question must help qualify the lead more deeply based on what they already said. Return only the spoken question, no labels, no bullets.",
        },
        {
          role: "user",
          content: [
            `Preferred language: ${languageOptions[language].label}`,
            `Name: ${session.name || "Unknown"}`,
            `Business type: ${session.businessType || "Unknown"}`,
            `Customer needs: ${session.customerNeeds || "Unknown"}`,
            `Automation target: ${session.automationTarget || "Unknown"}`,
            "Ask one concise question that uncovers urgency, volume, current process, or expected outcome.",
          ].join("\n"),
        },
      ],
    });

    return sanitizeQuestion(
      completion.choices[0]?.message?.content || "",
      language,
    );
  } catch {
    return fallbackPrompts[language];
  }
}