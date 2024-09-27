import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { task, count } = await request.json();

  // Validate the input
  if (typeof task !== 'string' || typeof count !== 'number') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    const subtasks = [
      `Research best practices for ${task}`,
      `Create a detailed plan for ${task}`,
      `Gather necessary resources for ${task}`,
      `Execute the first phase of ${task}`,
      `Review and adjust approach to ${task}`,
    ];

    const selectedSubtasks = subtasks.slice(0, count);
    return NextResponse.json({ subtasks: selectedSubtasks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate subtasks' }, { status: 500 });
  }
}
