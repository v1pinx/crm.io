import { GoogleGenerativeAI } from "@google/generative-ai";
import { Rule } from "@/types";
import toast from "react-hot-toast";

interface ProcessNLProps {
  nlQuery: string;
  setSegment: React.Dispatch<
    React.SetStateAction<{ name: string; description: string; rules: Rule[] }>
  >;
  setIsProcessingNL: (state: boolean) => void;
  setNlQuery: (text: string) => void;
}

// 🔐 Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export const processNaturalLanguage = async ({
  nlQuery,
  setSegment,
  setIsProcessingNL,
  setNlQuery,
}: ProcessNLProps) => {
  if (!nlQuery.trim()) return;

  setIsProcessingNL(true);

  try {
    // ✅ Use gemini-1.5-flash instead of gemini-pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a helpful assistant that converts natural language queries about customer segmentation into a JSON array of Rule objects.
Each rule must include:
- id (string)
- field (one of: "totalSpent", "visits", "lastVisit")
- operator (">" or "<")
- value (string)
- optional connector ("AND" or "OR")

Return **only** a JSON array — no explanations.

Input: "${nlQuery}"
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = result.response;
    const text = response.text();

    // Extract JSON safely
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const rawJson = text.substring(jsonStart, jsonEnd);

    const parsedRules: Rule[] = JSON.parse(rawJson);



    if (parsedRules.length > 0) {
      setSegment((prev) => ({
        ...prev,
        rules: parsedRules,
      }));
    }
  } catch (err) {
    console.error("Error using Gemini Flash:", err);
    toast.error("Failed to convert natural language to rules.");
  } finally {
    setIsProcessingNL(false);
    setNlQuery("");
  }
};

interface GenerateAIMessageProps {
  name: string;
  setMessage: (msg: string) => void;
  setIsGeneratingMessage: (val: boolean) => void;
}

export const generateAIMessage = async ({
  name,
  setMessage,
  setIsGeneratingMessage,
}: GenerateAIMessageProps) => {
  setIsGeneratingMessage(true);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a creative marketing assistant.
Generate a short and catchy marketing message for a customer named "${name}".
It should feel personal and engaging, and ideally contain an emoji. Do not include explanations.
Respond with only the message string.
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = result.response;
    const message = response.text().trim().replace(/^["']|["']$/g, ""); // Strip quotes if present

    setMessage(message);
  } catch (err) {
    console.error("Error generating message:", err);
    setMessage(`Hi ${name}, check out our latest offer!`);
  } finally {
    setIsGeneratingMessage(false);
  }
};

