import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    await db.admin.deleteMany(); 
    await db.aIMode.deleteMany(); 
    await db.chatbot.deleteMany(); 
    await db.user.deleteMany(); 
    return new Response(JSON.stringify('Deleted'));
  } catch (error) {
    console.log(error);
    return new Response(null, { status: 500 });
  }
}
