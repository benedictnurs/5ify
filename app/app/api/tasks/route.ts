// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectToDatabase, { isMongoConnected } from '@/app/lib/mongoose';
import User, { IUser } from '@/app/models/User';

interface Task {
  _id: string;
  text: string;
  completed: boolean;
  subtasks: Task[];
  collapsed: boolean;
}

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB if not already connected
    if (!isMongoConnected()) {
      await connectToDatabase();
    }

    // Extract authorId from query parameters
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId');

    if (!authorId) {
      return NextResponse.json(
        { success: false, message: 'authorId is required' },
        { status: 400 }
      );
    }

    // Find the user by authorId
    const user: IUser | null = await User.findOne({ authorId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Parse tasks from the user document
    let tasks: Task[] = [];
    try {
      tasks = JSON.parse(user.tasks);
    } catch (parseError) {
      console.error('Error parsing tasks:', parseError);
      return NextResponse.json(
        { success: false, message: 'Error parsing tasks' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, tasks },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB if not already connected
    if (!isMongoConnected()) {
      await connectToDatabase();
    }

    const { authorId, tasks } = await request.json();

    if (!authorId || !tasks) {
      return NextResponse.json(
        { success: false, message: 'authorId and tasks are required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        { success: false, message: 'tasks must be an array' },
        { status: 400 }
      );
    }

    // Find the user by authorId
    const user: IUser | null = await User.findOne({ authorId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found. Cannot update tasks.' },
        { status: 404 }
      );
    }

    // Update the tasks field as a JSON string
    user.tasks = JSON.stringify(tasks);
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Tasks updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating tasks:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
