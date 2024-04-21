import { db } from '@/lib/db';

export async function POST(req: Request): Promise<Response> {
  try {
    const { id } = await req.json();

    const user = await db.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user || !user.active) {
      return new Response(
        JSON.stringify({ error: 'User not found or inactive' }),
        {
          status: 404,
        }
      );
    }
    return new Response(JSON.stringify({ message: 'User is active' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error retrieving user:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve user' }), {
      status: 500,
    });
  }
}
