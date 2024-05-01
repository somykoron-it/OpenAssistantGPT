import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const password = await db.adminPassword.findFirst({});

    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password not found' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(password));
  } catch (error) {
    console.error('Error getting password:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve password' }),
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    // Extract old and new passwords from the request body
    const { oldPassword, newPassword } = await req.json();

    const currentPassword = await db.adminPassword.findFirst({});

    // Check if the old password matches the current password
    if (currentPassword?.password !== oldPassword || currentPassword == null) {
      return new Response(
        JSON.stringify({ error: 'Old password does not match' }),
        { status: 400 }
      );
    }

    // Update the password in the database
    const updatedPassword = await db.adminPassword.update({
      where: { id: currentPassword.id },
      data: { password: newPassword },
    });

    return new Response(JSON.stringify(updatedPassword));
  } catch (error) {
    console.error('Error updating password:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update password' }),
      { status: 500 }
    );
  }
}
