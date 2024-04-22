import { getCurrentUser } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Chat } from '@/components/ui/aimode/chat';
import { Chatbot, User } from '@prisma/client';
import { db } from '@/lib/db';
import Link from 'next/link';
import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

interface ChatbotSettingsProps {
  params: { chatbotId: string };
}

async function getChatbotForUser(chatbotId: Chatbot['id'], userId: User['id']) {
  return await db.aIMode.findFirst({
    where: {
      id: chatbotId,
      userId: userId,
    },
  });
}

export default async function ChatbotPage({ params }: ChatbotSettingsProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || '/login');
  }

  let chatbot = await getChatbotForUser(params.chatbotId, user.id);

  if (!chatbot) {
    notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Chat" text="Start chatting with your chatbot">
        <Link
          href={`/dashboard/chatbots`}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'md:left-8 md:top-8'
          )}
        >
          <>
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back
          </>
        </Link>
      </DashboardHeader>
      <div>
        <Chat chatbot={chatbot} defaultMessage=""></Chat>
      </div>
    </DashboardShell>
  );
}
