import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: Request) {
  try {
    const magicLinkUniquePart = uuidv4();
    const baseURL = process.env.BASE_URL;

    const magicLink = `${baseURL}/sign-up/${magicLinkUniquePart}`;
    console.log(magicLink);
    await db.admin.create({
      data: {
        magicLink: magicLink,
        magicLinkUniquePart: magicLinkUniquePart,
      },
    });

    return new Response(JSON.stringify(magicLink));
  } catch (error) {
    console.error('Error creating magic link:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create magic link' }),
      { status: 500 }
    );
  }
}

// export async function PATCH(req: Request) {
//   try {
//     const { magicLink, email } = await req.json();
//     const updatedRecord = await db.admin.update({
//       where: {
//         magicLink: magicLink,
//       },
//       data: {
//         email: email,
//       },
//     });
//     return new Response(JSON.stringify(updatedRecord));
//   } catch (error) {
//     console.error('Error updating record:', error);
//     return new Response(JSON.stringify({ error: 'Failed to update record' }), {
//       status: 500,
//     });
//   }
// }
