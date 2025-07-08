
import { GoogleGenAI } from "@google/genai";
import { NetworkType } from "../types";
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

const prompts = {
  plain: `
    You are an expert in deep learning. Explain the concept of a "plain" deep neural network.

    1.  **Core Idea:** Describe how it stacks layers sequentially.
    2.  **Information Flow:** Explain how the output of one layer becomes the input for the next.
    3.  **The Problem with Depth:** Clearly explain the "vanishing gradient problem" that occurs as these networks get very deep. Why does this make them hard to train?
    4.  **Analogy:** Use a simple analogy, like the "game of telephone," to illustrate how information can be distorted or lost through many layers.

    Format your response in Markdown. Use headings, bold text, and bullet points to make it easy to read.
  `,
  resnet: `
    You are an expert in deep learning. Explain the concept of a Deep Residual Network (ResNet).

    1.  **Core Innovation:** Describe the "residual block" and the "shortcut" or "skip connection" as the key innovation. Explain the formula H(x) = F(x) + x.
    2.  **Solving the Problem:** How does this shortcut connection help solve the vanishing gradient problem found in plain networks? Explain how it allows gradients to flow more easily.
    3.  **Benefit:** What is the main benefit? (Allowing for much deeper, more powerful, and trainable networks).
    4.  **Analogy:** Use a simple analogy. For example, an expert artist starting with a rough sketch (the identity x) and then adding details (the residual F(x)), rather than drawing from scratch at every step.

    Format your response in Markdown. Use headings, bold text, and bullet points to make it easy to read.
  `
};

// In a secure environment, you would use `process.env.API_KEY`.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn("API_KEY environment variable not set. API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "YOUR_API_KEY_HERE" });

export const getExplanation = async (networkType: NetworkType): Promise<string> => {
  if (!apiKey) {
      return Promise.resolve(md.render(`**Error:** API Key is not configured.

Please set the \`API_KEY\` environment variable to use this feature.

This application uses the Google Gemini API to generate explanations. Without a valid API key, it cannot connect to the service.

**For Developers:**
1. Obtain an API key from Google AI Studio.
2. Set it as an environment variable named \`API_KEY\` in your deployment environment.
`));
  }
    
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompts[networkType],
    });

    const text = response.text;
    return md.render(text);
  } catch (error) {
    console.error(`Error generating content for ${networkType}:`, error);
    throw new Error(`Failed to generate explanation from Gemini API.`);
  }
};
