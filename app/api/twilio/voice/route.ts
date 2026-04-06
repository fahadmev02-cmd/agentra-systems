import { randomUUID } from "node:crypto";
import { appendLeadToWorkbook } from "@/lib/lead-workbook";
import { generateDynamicFollowUpQuestion } from "@/lib/groq-call-flow";
import {
  detectLanguage,
  getAppBaseUrl,
  languageOptions,
  normalizeBudget,
  toLeadRow,
  type LeadLanguage,
} from "@/lib/voice-agent-config";
import { generateLeadSummary } from "@/lib/groq-lead-summary";
import { getLeadSession, updateLeadSession } from "@/lib/voice-session-store";
import twilio from "twilio";

export const runtime = "nodejs";

const { VoiceResponse } = twilio.twiml;

function buildStepUrl(sessionId: string, step: string) {
  return `${getAppBaseUrl()}/api/twilio/voice?sessionId=${sessionId}&step=${step}`;
}

function getVoiceForLanguage(language?: LeadLanguage) {
  return "Polly.Aditi";
}

function getPromptLanguage(language?: LeadLanguage) {
  return language ? languageOptions[language].sayLanguage : "en-IN";
}

function textByLanguage(language: LeadLanguage | undefined, copy: {
  english: string;
  hindi: string;
  hinglish: string;
}) {
  return copy[language ?? "english"];
}

function speak(response: InstanceType<typeof VoiceResponse>, language: LeadLanguage | undefined, text: string) {
  response.say(
    { voice: getVoiceForLanguage(language) as never, language: getPromptLanguage(language) as never },
    text,
  );
}

function gatherSpeech(response: InstanceType<typeof VoiceResponse>, options: {
  action: string;
  language?: LeadLanguage;
  prompt: string;
  allowDigits?: boolean;
  numDigits?: number;
}) {
  const gather = response.gather({
    input: options.allowDigits ? ["speech", "dtmf"] : ["speech"],
    action: options.action,
    method: "POST",
    speechTimeout: "auto",
    numDigits: options.numDigits,
    language: getPromptLanguage(options.language) as never,
  });

  gather.say(
    {
      voice: getVoiceForLanguage(options.language) as never,
      language: getPromptLanguage(options.language) as never,
    },
    options.prompt,
  );
}

function appendTranscriptEntry(label: string, value?: string) {
  if (!value) {
    return null;
  }

  return `${label}: ${value}`;
}

async function finalizeLead(sessionId: string) {
  const session = await getLeadSession(sessionId);
  if (!session) {
    return null;
  }

  const summary = await generateLeadSummary(session);
  const updatedSession = await updateLeadSession(sessionId, {
    summary,
    status: "completed",
  });

  if (updatedSession) {
    await appendLeadToWorkbook(toLeadRow(updatedSession));
  }

  return updatedSession;
}

async function handleVoice(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId") || randomUUID();
  const step = url.searchParams.get("step") || "intro";
  const formData = request.method === "POST" ? await request.formData() : new FormData();
  const speechResult = formData.get("SpeechResult")?.toString().trim();
  const digits = formData.get("Digits")?.toString().trim();
  const callSid = formData.get("CallSid")?.toString();

  const response = new VoiceResponse();
  const session = await getLeadSession(sessionId);

  if (!session) {
    speak(response, undefined, "We could not find your strategy call session. Please try again from the website.");
    response.hangup();
    return new Response(response.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }

  if (callSid && session.callSid !== callSid) {
    await updateLeadSession(sessionId, { callSid });
  }

  if (step === "intro") {
    speak(
      response,
      undefined,
      "Hi, this is Fahad's AI assistant from Agentra Systems. We build AI automation systems for businesses. Do you prefer English, Hindi, or Hinglish? Press 1 for English, 2 for Hindi, or 3 for Hinglish.",
    );
    gatherSpeech(response, {
      action: buildStepUrl(sessionId, "language"),
      prompt: "Please say your preferred language now, or use your keypad.",
      allowDigits: true,
      numDigits: 1,
    });
    response.redirect(buildStepUrl(sessionId, "language"));
  }

  if (step === "language") {
    const language = detectLanguage(speechResult, digits);
    await updateLeadSession(sessionId, {
      language,
      transcript: [
        ...session.transcript,
        appendTranscriptEntry("Language", languageOptions[language].label),
      ].filter(Boolean) as string[],
    });

    gatherSpeech(response, {
      action: buildStepUrl(sessionId, "name"),
      language,
      prompt: textByLanguage(language, {
        english: "Great. Before we begin, what should I call you?",
        hindi: "Shukriya. Shuru karne se pehle, main aapko kis naam se bulaun?",
        hinglish: "Great. Start karne se pehle, main aapko kis naam se bulaun?",
      }),
    });
    response.redirect(buildStepUrl(sessionId, "name"));
  }

  if (step === "name") {
    const language = session.language;
    const nextTranscript = [...session.transcript];
    const nameEntry = appendTranscriptEntry("Name", speechResult);
    if (nameEntry) {
      nextTranscript.push(nameEntry);
    }

    await updateLeadSession(sessionId, {
      name: speechResult || session.name,
      transcript: nextTranscript,
    });

    gatherSpeech(response, {
      action: buildStepUrl(sessionId, "business"),
      language,
      prompt: textByLanguage(language, {
        english: "Tell me about your business. What type of business do you run?",
        hindi: "Apne business ke baare mein batayein. Aap kis type ka business chalate hain?",
        hinglish: "Apne business ke baare mein batayein. Aap kis type ka business run karte hain?",
      }),
    });
    response.redirect(buildStepUrl(sessionId, "business"));
  }

  if (step === "business") {
    const language = session.language;
    const businessType = speechResult || session.businessType;
    const nextTranscript = [...session.transcript];
    const businessEntry = appendTranscriptEntry("Business Type", speechResult);
    if (businessEntry) {
      nextTranscript.push(businessEntry);
    }

    await updateLeadSession(sessionId, {
      businessType,
      transcript: nextTranscript,
    });

    gatherSpeech(response, {
      action: buildStepUrl(sessionId, "customer-needs"),
      language,
      prompt: textByLanguage(language, {
        english: `In your ${businessType || "business"}, what do customers usually need help with, and where do you feel the process breaks today?`,
        hindi: `${businessType || "Aapke business"} mein customers ko aam tor par kis cheez mein help chahiye hoti hai, aur process sabse zyada kahan break hota hai?`,
        hinglish: `${businessType || "Aapke business"} mein customers ko aam tor par kis cheez mein help chahiye hoti hai, aur process sabse zyada kahan break hota hai?`,
      }),
    });
    response.redirect(buildStepUrl(sessionId, "customer-needs"));
  }

  if (step === "customer-needs") {
    const language = session.language;
    const nextTranscript = [...session.transcript];
    const customerNeedsEntry = appendTranscriptEntry("Customer Needs", speechResult);
    if (customerNeedsEntry) {
      nextTranscript.push(customerNeedsEntry);
    }

    await updateLeadSession(sessionId, {
      customerNeeds: speechResult || session.customerNeeds,
      transcript: nextTranscript,
    });

    gatherSpeech(response, {
      action: buildStepUrl(sessionId, "automation-target"),
      language,
      prompt: textByLanguage(language, {
        english:
          "What would you want the AI system to automate first for you: lead qualification, support, bookings, follow-ups, or something more custom?",
        hindi:
          "Aap sabse pehle AI se kya automate karwana chahenge: lead qualification, support, bookings, follow-ups, ya kuch aur custom?",
        hinglish:
          "Aap sabse pehle AI se kya automate karwana chahenge: lead qualification, support, bookings, follow-ups, ya kuch aur custom?",
      }),
    });
    response.redirect(buildStepUrl(sessionId, "automation-target"));
  }

  if (step === "automation-target") {
    const language = session.language;
    const nextTranscript = [...session.transcript];
    const automationTargetEntry = appendTranscriptEntry("Automation Target", speechResult);
    if (automationTargetEntry) {
      nextTranscript.push(automationTargetEntry);
    }

    const updatedSession = await updateLeadSession(sessionId, {
      automationTarget: speechResult || session.automationTarget,
      transcript: nextTranscript,
    });

    const dynamicQuestion = await generateDynamicFollowUpQuestion(
      updatedSession ?? {
        ...session,
        automationTarget: speechResult || session.automationTarget,
        transcript: nextTranscript,
      },
    );

    await updateLeadSession(sessionId, { dynamicQuestion });

    gatherSpeech(response, {
      action: buildStepUrl(sessionId, "follow-up"),
      language,
      prompt: dynamicQuestion,
    });
    response.redirect(buildStepUrl(sessionId, "follow-up"));
  }

  if (step === "follow-up") {
    const language = session.language;
    const nextTranscript = [...session.transcript];
    const followUpEntry = appendTranscriptEntry("Qualification Note", speechResult);
    if (followUpEntry) {
      nextTranscript.push(followUpEntry);
    }

    await updateLeadSession(sessionId, {
      dynamicAnswer: speechResult || session.dynamicAnswer,
      transcript: nextTranscript,
    });

    gatherSpeech(response, {
      action: buildStepUrl(sessionId, "budget"),
      language,
      prompt: textByLanguage(language, {
        english: "If you are comfortable sharing, what budget range are you considering for this automation?",
        hindi: "Agar aap share karna chahein, is automation ke liye aapka budget range kya hai?",
        hinglish: "Agar aap comfortable hain, is automation ke liye aap kis budget range ke baare mein soch rahe hain?",
      }),
    });
    response.redirect(buildStepUrl(sessionId, "budget"));
  }

  if (step === "budget") {
    const nextTranscript = [...session.transcript];
    const budgetEntry = appendTranscriptEntry("Budget", speechResult);
    if (budgetEntry) {
      nextTranscript.push(budgetEntry);
    }

    await updateLeadSession(sessionId, {
      budget: normalizeBudget(speechResult),
      transcript: nextTranscript,
    });

    const finalizedSession = await finalizeLead(sessionId);
    speak(
      response,
      finalizedSession?.language,
      textByLanguage(finalizedSession?.language, {
        english:
          "Thanks. I have captured your details and shared them with Fahad's team. They will follow up with the best automation plan for your business shortly.",
        hindi:
          "Shukriya. Maine aapki details capture kar li hain aur Fahad ki team ke saath share kar di hain. Woh jald hi aapse best automation plan ke saath contact karegi.",
        hinglish:
          "Thanks. Maine aapki details capture kar li hain aur Fahad ki team ko share kar di hain. Woh jaldi aapse best automation plan ke saath follow up karegi.",
      }),
    );
    response.hangup();
  }

  return new Response(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}

export async function GET(request: Request) {
  return handleVoice(request);
}

export async function POST(request: Request) {
  return handleVoice(request);
}
