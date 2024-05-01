import { db } from '@/lib/db';

interface Item {
  registrationId: string;
  name: string;
  email: string;
  hasAccess: boolean;
  isActive: boolean;
}

function extractData(arr: any) {
  return arr.map((obj: any, index: number) => ({
    id: index + 1,
    registrationId: obj.magicLink, // Extract the last part of the magicLink URL
    name: obj.name,
    email: obj.email,
    hasAccess: obj.premium,
    isActive: obj.active,
  }));
}

export async function GET(req: Request) {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return new Response(JSON.stringify(extractData(users)));
  } catch (error) {
    console.error('Error creating magic link:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create magic link' }),
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { email, ...updateData } = await req.json();
    console.log(email);
    console.log(updateData);
    const updatedRecord = await db.user.update({
      where: {
        email: email,
      },
      data: updateData,
    });
    return new Response(JSON.stringify(updatedRecord));
  } catch (error) {
    console.error('Error updating record:', error);
    return new Response(JSON.stringify({ error: 'Failed to update record' }), {
      status: 500,
    });
  }
}
