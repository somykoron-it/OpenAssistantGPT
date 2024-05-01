import { db } from '@/lib/db';

export async function POST(req: Request): Promise<Response> {
  try {
    // Extract data from the request body
    const { name, email, password, magicLink } = await req.json();

    // Check if the magic link already exists
    const existingUser = await db.admin.findFirst({
      where: {
        magicLink: magicLink,
      },
    });

    // If magic link is already used, return a 409 Conflict response
    if (!existingUser) {
      return new Response(
        JSON.stringify({ error: 'Magic link not available' }),
        { status: 400 }
      );
    }

    // Create the user with provided data
    const createdUser = await db.user.create({
      data: {
        name: name,
        email: email,
        password: password,
        magicLink: magicLink,
      },
    });

    // Update the admin record with the user's email
    // await db.admin.update({
    //   where: {
    //     magicLink: magicLink,
    //   },
    //   data: {
    //     email: email,
    //   },
    // });

    // Return the created user as JSON response
    return new Response(JSON.stringify(createdUser), { status: 201 });
  } catch (error) {
    // Handle any errors and return a 500 Internal Server Error response
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ error: 'Failed to create user' }), {
      status: 500,
    });
  }
}
