import { ai } from '@/lib/gemini';
import { generateAnalysis } from '@/lib/repoAnalysis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const userPrompt = await generateAnalysis(body.prompt);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('API Error:', errorMessage);

    if (errorMessage.includes('Unexpected end of JSON input')) {
      return NextResponse.json({ success: false, error: 'JSON 형식으로 보내주세요.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
