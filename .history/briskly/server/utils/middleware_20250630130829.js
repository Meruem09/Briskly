import { PrismaClient } from '@prisma/client';
import { clerkClient } from "@clerk/express";

const prisma = new PrismaClient();

async function findOrCreateUser(clerkUserId, extraData = {}) {
  try {
    let user = await prisma.user.findUnique({ where: { clerkId: clerkUserId } });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);

      user = await prisma.user.create({
        data: {
          clerkId: clerkUserId,
          name: extraData.username || clerkUser.username || 'Anonymous',
          email: extraData.email || clerkUser.emailAddresses?.[0]?.emailAddress || '',
        },
      });
    }

    return user;
  } catch (error) {
    console.error('findOrCreateUser error:', error);
    throw error;
  }
}

export default findOrCreateUser;
