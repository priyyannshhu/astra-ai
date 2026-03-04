import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid prompt provided" },
        { status: 400 }
      );
    }

    const enhancementPrompt = `You are an expert at refining and enhancing user prompts for AI app generation. 
Your task is to improve the following project description by:
1. Adding more specific technical details
2. Expanding the feature set with relevant additions
3. Clarifying the user's intent
4. Suggesting best practices for the implementation
5. Making it more detailed and actionable for code generation

Original prompt: "${prompt}"

Provide only the enhanced prompt, no explanations or additional text. Make it detailed, specific, and ready for code generation.`;

    const result = await chatSession.sendMessage(enhancementPrompt);
    const enhancedPrompt = result.response.text();

    return NextResponse.json({ 
      enhancedPrompt,
      originalPrompt: prompt,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return NextResponse.json(
      { error: error.message || "Failed to enhance prompt" },
      { status: 500 }
    );
  }
}
