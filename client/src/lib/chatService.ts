import { GoogleGenerativeAI } from "@google/generative-ai";
import { getWebsiteContextPrompt } from "@/lib/websiteContext";

// Initialize Google Generative AI with API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
console.log("Gemini API Key present:", !!apiKey);

if (!apiKey) {
  console.error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Use the gemini-2.5-flash model as requested
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  systemInstruction: `You are a helpful assistant for HighFive Enterprises. You should only answer questions related to HighFive Enterprises website, its services, team, projects, events, or other company-related topics. For any questions that are not related to HighFive Enterprises or its business, politely decline to answer and suggest contacting the team directly at teamhfive25@gmail.com.

Use the following website context to provide accurate information:
${getWebsiteContextPrompt()}`,
  generationConfig: {
    temperature: 0.5, // Medium creativity
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  }
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function sendMessage(messages: ChatMessage[]): Promise<string> {
  try {
    // Check if API key is present
    if (!apiKey) {
      return "API key is missing. Please configure your Google Gemini API key.";
    }
    
    // Get the latest user message
    const latestMessage = messages[messages.length - 1]?.content || "";
    console.log("Sending message to Gemini:", latestMessage);

    // Generate content with the latest message
    const result = await model.generateContent(latestMessage);
    const response = await result.response;
    console.log("Received response from Gemini:", response.text());
    return response.text();
  } catch (error: any) {
    console.error("Error sending message to Gemini:", error);
    
    // Provide more specific error messages
    if (error.message) {
      return error.message;
    } else {
      return "Sorry, I'm having trouble connecting to the AI service right now. Please try again later or contact us directly at teamhfive25@gmail.com.";
    }
  }
}