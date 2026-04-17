// Voiceflow API configuration
const API_KEY = import.meta.env.VITE_VOICEFLOW_API_KEY || "";
const VERSION_ID = import.meta.env.VITE_VOICEFLOW_VERSION_ID || "development";
const BASE_URL = "https://general-runtime.voiceflow.com";

console.log("Voiceflow API Key present:", !!API_KEY);

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  type?: string;
  payload?: any;
}

/**
 * Sends a message to the Voiceflow agent "Luna"
 */
export async function sendMessage(
  message: string,
  userID: string = "user_123"
): Promise<ChatMessage[]> {
  try {
    if (!API_KEY) {
      return [{
        role: "assistant",
        content: "Voiceflow API key is missing. Please configure VITE_VOICEFLOW_API_KEY."
      }];
    }

    const response = await fetch(`${BASE_URL}/state/user/${userID}/interact`, {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        versionID: VERSION_ID,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: {
          type: "text",
          payload: message
        },
        config: {
          tts: false,
          stripSSML: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const traces = await response.json();
    const messages: ChatMessage[] = [];

    for (const trace of traces) {
      if (trace.type === "text" || trace.type === "speak") {
        messages.push({
          role: "assistant",
          content: trace.payload.message,
          type: "text"
        });
      } else if (trace.type === "choice") {
        messages.push({
          role: "assistant",
          content: "Please choose an option:",
          type: "choice",
          payload: trace.payload.choices
        });
      }
    }

    return messages;
  } catch (error: any) {
    console.error("Error sending message to Voiceflow:", error);
    return [{
      role: "assistant",
      content: "Sorry, I'm having trouble connecting to Luna right now. Please try again later."
    }];
  }
}

/**
 * Starts a new conversation session
 */
export async function startConversation(userID: string = "user_123"): Promise<ChatMessage[]> {
  try {
    if (!API_KEY) {
      return [{
        role: "assistant",
        content: "Voiceflow API key is missing. Please configure VITE_VOICEFLOW_API_KEY."
      }];
    }

    const response = await fetch(`${BASE_URL}/state/user/${userID}/interact`, {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        versionID: VERSION_ID,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: {
          type: "launch"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const traces = await response.json();
    const messages: ChatMessage[] = [];

    for (const trace of traces) {
      if (trace.type === "text" || trace.type === "speak") {
        messages.push({
          role: "assistant",
          content: trace.payload.message,
          type: "text"
        });
      }
    }

    return messages;
  } catch (error: any) {
    console.error("Error starting conversation with Voiceflow:", error);
    return [{
      role: "assistant",
      content: "Hi, I'm Luna. I'm having some trouble starting our conversation. Please check my configuration."
    }];
  }
}