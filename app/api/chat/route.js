import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json({ 
        reply: "I'm here to listen. As an AI assistant, I'm designed to provide support and guidance. How are you feeling today?" 
      });
    }

    const openai = new OpenAI({ apiKey });

    // Create a more contextual prompt for mental health support
    const prompt = `You are SIFRA, a compassionate AI mental health companion. Respond to the user with empathy and care. 
    Keep responses concise but supportive. If the user seems distressed, gently suggest breathing exercises or professional help.
    User message: "${message}"
    
    Respond directly without any prefixes like "SIFRA:" or "Assistant:"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content.trim();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    // Return a friendly fallback message instead of failing
    return NextResponse.json({ 
      reply: "I'm here with you. Sometimes it helps to just talk about what's on your mind. Would you like to share more about how you're feeling?" 
    });
  }
}