import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();
  try {
    const result = await GenAiCode.sendMessage(prompt);
    const respo = result.response.text();
    return NextResponse.json(JSON.parse(respo));
  } catch (error) {
    console.error("Error generating AI code:", error);
    return NextResponse.error({ error: error.message });
  }
}
