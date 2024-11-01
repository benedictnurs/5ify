import { NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(request: Request) {
  try {
    const { task, subtaskFlatten, count } = await request.json();
    console.log('Request:', { task, subtaskFlatten, count });
    if (typeof task !== 'string' || typeof count !== 'number') {
      console.error('invalid', { task, count });
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    const GoogleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!GoogleKey) {
      return NextResponse.json(
        { error: 'API key missing' },
        { status: 500 }
      );
    }

    const googleAI = createGoogleGenerativeAI({
      apiKey: GoogleKey,
    });

    const model = googleAI('gemini-1.5-pro');

    const prompt = `STRICTLY FOLLOW THESE DIRECTIONS LIKE YOUR LIFE DEPENDS ON IT Create a list of ${count} brief and concise subtasks for the main task: "${task}" if there are subtasks here STRICTLY DO NOT REPEAT:"${subtaskFlatten}" Ensure each subtask is clear and actionable. Return the subtasks as a JSON array of strings VERY IMPORTANT STRICTLY DO NOT RETURN ASTERISKS IN ANY CASE, DO NOT USE BACKTICKS STRICTLY NO BACKTICKS OR OUTSIDE FORMATS AT ALL AND STRICTLY DO NOT NUMBER!!!!`;

    console.log('AI Prompt:', prompt);

    const { text: aiText } = await generateText({
      model: model,
      prompt: prompt,
      temperature: 0.7,
    });

    console.log('AI:', aiText);

    let subtasks: string[] = [];

    try {
      subtasks = JSON.parse(aiText);
      console.log('subtasks:', subtasks);
    } catch (error) {
      subtasks = aiText
        .split('\n')
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((line: string) => line.length > 0)
        .slice(0, count);
    }

    subtasks = subtasks.slice(0, count);

    return NextResponse.json({ subtasks: subtasks });
  } catch (error: any) {
    console.error('Not my fault you cant run it...', error.message || error);
    return NextResponse.json({ error: 'Broken Contact Customert Support... jk ur all alone.' }, { status: 500 });
  }
}
