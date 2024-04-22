import { db } from '@/lib/db';

export async function POST(req: Request): Promise<Response> {
  try {
    const { ...data } = await req.json();

    const existingUser = await db.user.findFirst({
      where: {
        id: data.user_id,
      },
    });

    if (!existingUser) {
      return new Response(JSON.stringify({ error: 'No User found' }), {
        status: 400,
      });
    }

    // Create the user with provided data
    const createAIMode = await db.aIMode.create({
      data: data,
    });

    // Return the created user as JSON response
    return new Response(JSON.stringify(createAIMode), { status: 201 });
  } catch (error) {
    // Handle any errors and return a 500 Internal Server Error response
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ error: 'Failed to create user' }), {
      status: 500,
    });
  }
}

