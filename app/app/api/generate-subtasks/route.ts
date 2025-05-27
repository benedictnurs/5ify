import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export async function POST(request: Request) {
  try {
    const { task, subtaskFlatten, count, intensity } = await request.json();
    if (typeof task !== "string" || typeof count !== "number") {
      console.error("invalid", { task, count });
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const GoogleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!GoogleKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }
    // Using Langchain to generate subtasks based on the input by structuring the output through chaining the prompt, model, and output parser
    const chatModel = new ChatGoogleGenerativeAI({
      apiKey: GoogleKey,
      modelName: "gemini-2.0-flash",
    });
    const prompt = ChatPromptTemplate.fromMessages([
      {
        role: "system",
        content:
          "You are Jarvis, the highly intelligent assistant from the movie Iron Man. Your responses must be strictly professional, accurate, and fact-based. Only use the information provided in the input. Do not make assumptions, infer details not explicitly stated, or hallucinate any information. If the input lacks sufficient detail, clearly indicate what is missing instead of guessing. Adhere strictly to the instructions and provide concise, logical, and actionable outputs. You must not include any irrelevant content or deviate from the specified task requirements.",
      },
      {
        role: "user",
        content: `
You are a professional assistant that generates highly structured and logically sequenced tasks. Follow these instructions carefully and produce output accordingly:

Create a JSON array of exactly {count} subtasks for the main task: "{task}". The subtasks must have a detail level determined by {intensity}, defined as follows:
- Level 1: Very brief (1-2 sentences, less than 15 words per subtask).
- Level 2: Concise (2-3 sentences, 15-25 words per subtask).
- Level 3: Moderately detailed (2-4 sentences, 25-40 words per subtask).
- Level 4: Detailed (3-5 sentences, 40-60 words per subtask).
- Level 5: Highly detailed (5+ sentences, over 60 words per subtask, covering thorough instructions, examples, and rationale).

Ensure each subtask:
1. Is clear, actionable, and logically follows the previous subtask.
2. Avoids repeating any subtasks from this list: "{subtaskFlatten}".
3. Is directly related to the main task and logically builds toward its completion.
4. Is written at the requested detail level based on the {intensity} scale.

STRICT INSTRUCTIONS:
- Return the subtasks ONLY as a JSON array of strings.
- DO NOT include any numbering, special formatting, asterisks, backticks, or additional explanation.
- STRICTLY adhere to the requested detail level for each subtask.
- Example of desired format: ["Subtask 1", "Subtask 2", "Subtask 3"].

Input values:
- Main task: "{task}"
- Excluded subtasks: "{subtaskFlatten}"
- Detail level: {intensity} (1 = very brief, 5 = highly detailed)
- Number of subtasks: {count}

Output ONLY the JSON array of strings. DO NOT include any additional text, explanations, or formatting. 
      `,
      },
    ]);

    const outputParser = new StringOutputParser();
    const llmChain = prompt.pipe(chatModel).pipe(outputParser);
    const response = await llmChain.invoke({
      count: count,
      intensity: intensity,
      task: task,
      subtaskFlatten: subtaskFlatten,
    });

    // Parsing the response to get the subtasks to output to the frontend
    let subtasks: string[] = [];

    try {
      const cleaned = response
        .trim()
        .replace(/^```json\s*/i, "")  // Remove starting ```json
        .replace(/```$/, "");         // Remove ending ```
        
      subtasks = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Invalid LLM response:", response);
      throw new Error("LLM returned invalid JSON. Cleaned attempt also failed.");
    }
    return NextResponse.json({ subtasks: subtasks });

  } catch (error: any) {
    console.error("Not my fault you cant run it...", error.message || error);
    return NextResponse.json(
      { error: "Broken Contact Customert Support... jk ur all alone." },
      { status: 500 }
    );
  }
}
