import { Webhook } from 'svix';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase, { isMongoConnected } from '@/app/lib/mongoose';
import User from '@/app/models/User';

export const runtime = "nodejs"

/**
 * Handles POST requests for Clerk webhooks.
 * 
 * @param req - The incoming NextRequest object.
 * @returns NextResponse indicating the result of the webhook processing.
 */
export async function POST(req: NextRequest) {
  console.log('Received a webhook POST request');

  // Clerk webhook secret
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('WEBHOOK_SECRET is not defined in environment variables');
    return NextResponse.json(
      { success: false, message: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  // Extract Svix headers
  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing Svix headers');
    return NextResponse.json(
      { success: false, message: 'Missing Svix headers' },
      { status: 400 }
    );
  }

  console.log('Svix headers received:', { svix_id, svix_timestamp, svix_signature });

  // Get the raw body
  const payload = await req.text();
  const body = payload;

  console.log('Webhook payload received:', body);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
    console.log('Webhook verified successfully:', evt);
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json(
      { success: false, message: 'Error verifying webhook' },
      { status: 400 }
    );
  }

  // Connect to MongoDB
  try {
    if (!isMongoConnected()) {
      await connectToDatabase();
      console.log('Connected to MongoDB successfully');
    } else {
      console.log('Already connected to MongoDB');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { success: false, message: 'Database connection error' },
      { status: 500 }
    );
  }

  // Handle different event types
  const { type, data } = evt;
  console.log(`Handling event type: ${type}`);

  try {
    if (type === 'user.created') {
      await handleUserCreated(data);
    } else if (type === 'user.updated') {
      await handleUserUpdated(data);
    } else if (type === 'user.deleted') {
      await handleUserDeleted(data);
    } else {
      console.log(`Unhandled event type ${type}`);
    }
    return NextResponse.json(
      { success: true, message: 'Webhook received and processed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing webhook event' },
      { status: 500 }
    );
  }
}

/**
 * Handler for 'user.created' event.
 * Creates a new user in the database with predefined tasks.
 * 
 * @param data - The event data containing user information.
 */
async function handleUserCreated(data: any) {
  const { id } = data;

  console.log(`Processing user.created event for user ID: ${id}`);

  try {
    // Check if the user already exists to prevent duplicates
    const existingUser = await User.findOne({ authorId: id });
    if (existingUser) {
      console.warn(`User with authorId ${id} already exists`);
      return;
    }

    // Define the initial tasks array
    const initialTasks = [];

    // Create a new user with the initial tasks as a JSON string
    await User.create({
      authorId: id,
      tasks: JSON.stringify(initialTasks),
    });
    console.log(`User created in database: ${id} with initial tasks`);
  } catch (error) {
    console.error(`Error creating user in database: ${id}`, error);
    throw error; // Rethrow to be caught in the main POST function
  }
}

/**
 * Handler for 'user.updated' event.
 * Updates user information in the database.
 * 
 * @param data - The event data containing updated user information.
 */
async function handleUserUpdated(data: any) {
  const { id } = data;

  console.log(`Processing user.updated event for user ID: ${id}`);

  try {
    // Since the User schema only stores authorId and tasks as a string, determine what needs updating
    // If you have additional fields, update them here. For now, there's nothing to update.
    console.log(`No update action required for user ID: ${id}`);
  } catch (error) {
    console.error(`Error updating user in database: ${id}`, error);
    throw error; // Rethrow to be caught in the main POST function
  }
}

/**
 * Handler for 'user.deleted' event.
 * Deletes a user from the database.
 * 
 * @param data - The event data containing user information.
 */
async function handleUserDeleted(data: any) {
  const { id } = data;

  console.log(`Processing user.deleted event for user ID: ${id}`);

  try {
    const deletedUser = await User.findOneAndDelete({ authorId: id });
    if (deletedUser) {
      console.log(`User deleted from database: ${id}`);
      // Optionally, delete associated tasks or perform other cleanup here
    } else {
      console.warn(`User not found for deletion: ${id}`);
    }
  } catch (error) {
    console.error(`Error deleting user from database: ${id}`, error);
    throw error; // Rethrow to be caught in the main POST function
  }
}
