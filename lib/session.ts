import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { db } from './db';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function getActiveUser(id: string) {
  const foundUser = await db.user.findFirst({
    where: {
      id: id,
    },
  });
  return foundUser?.active;
}
