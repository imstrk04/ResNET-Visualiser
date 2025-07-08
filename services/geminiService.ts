import { GoogleGenAI } from "@google/genai";
import { NetworkType } from "../types";
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

const prompts = {
  plain: `
    You are an expert in deep learning. Explain the concept of a "plain" deep neural network in a clear, educational manner.

    1. **Core Idea:** Describe how it stacks layers sequentially and information flows through them.
    2. **The Problem:** Explain the vanishing gradient problem and why it makes deep networks hard to train.
    3. **Visual Degradation:** Explain how information quality degrades as it passes through many layers.
    4. **Limitations:** Discuss the practical limits of plain network depth.
    5. **Simple Analogy:** Use the "telephone game" or similar analogy to illustrate information loss.

    Keep it concise but informative. Format in Markdown with clear sections.
  `,
  resnet: `
    You are an expert in deep learning. Explain ResNet (Residual Networks) and how they solve the vanishing gradient problem.

    1. **Core Innovation:** Explain residual blocks and skip connections with the formula H(x) = F(x) + x.
    2. **Problem Solved:** How skip connections prevent vanishing gradients and preserve information.
    3. **Training Benefits:** Why ResNets can be trained much deeper (100+ layers) than plain networks.
    4. **Information Flow:** How the identity mapping preserves original features.
    5. **Real Impact:** Mention their revolutionary impact on computer vision and deep learning.
    6. **Analogy:** Use the "building on a foundation" or "editor improving a draft" analogy.

    Keep it educational and accessible. Format in Markdown with clear sections.
  `
};

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn("API_KEY environment variable not set. API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "YOUR_API_KEY_HERE" });

export const getExplanation = async (networkType: NetworkType): Promise<string> => {
  if (!apiKey) {
    return Promise.resolve(md.render(`**Error:** API Key is not configured.

Please set the \`API_KEY\` environment variable to use this feature.

This application uses the Google Gemini API to generate explanations.`));
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