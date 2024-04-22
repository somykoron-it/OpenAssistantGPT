import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';
import { ChatbotCreateButton } from '@/components/ui/aimode/chatbot-create-button';
import { ChatbotItem } from '@/components/ui/aimode/chatbot-item';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: `${siteConfig.name} - Chatbots`,
};

export default async function ChatbotsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || '/login');
  }

  const bots: any[] = await db.aIMode.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      buesinessName: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const userData = await db.user.findFirst({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      premium: true,
    },
  });

  return (
    <>
      {userData && userData.premium ? (
        <DashboardShell>
          <DashboardHeader
            heading="Business Chatbot"
            text="Create and manage your business chatbots."
          >
            <ChatbotCreateButton />
          </DashboardHeader>
          <div>
            {bots && bots.length ? (
              <div className="divide-y divide-border rounded-md border">
                {bots.map((bot) => (
                  <ChatbotItem key={bot.id} chatbot={bot} model={bot.model} />
                ))}
              </div>
            ) : (
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon name="bot" />
                <EmptyPlaceholder.Title>
                  No chatbot created
                </EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  You don't have any chatbot yet. Start creating.
                </EmptyPlaceholder.Description>
                <ChatbotCreateButton variant="outline" />
              </EmptyPlaceholder>
            )}
          </div>
        </DashboardShell>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            You don't have premium access.
          </h1>
          <p>Please upgrade your account to access this feature.</p>
        </div>
      )}
    </>
  );
}
