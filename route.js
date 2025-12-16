import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { text, voice, ssml } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    // Use OpenAI TTS model to generate audio
    const createParams = {
      model: "gpt-4o-mini-tts",
      voice: voice || "female",
      input: text,
    };

    if (ssml) {
      // indicate to the SDK/server that the input contains SSML
      createParams.ssml = true;
    }

    const response = await openai.audio.speech.create(createParams);

    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": "inline; filename=voice.wav",
      },
    });
  } catch (err) {
    console.error("TTS error:", err);
    return NextResponse.json({ error: "TTS generation failed" }, { status: 500 });
  }
}
