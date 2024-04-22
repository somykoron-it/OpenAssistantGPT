import Link from 'next/link';
import { Chatbot, ChatbotModel } from '@prisma/client';

import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatbotOperations } from './chatbot-operations';

interface ChatbotProps {
  chatbot: any;
  model: any;
}

export function ChatbotItem({ chatbot, model }: ChatbotProps) {
  console.log(chatbot);
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/dashboard/aimode/chatbots/${chatbot.id}/chat`}
          className="font-semibold hover:underline"
        >
          {chatbot?.buesinessName}
        </Link>
        <div>
          {/* <p className="text-sm text-muted-foreground">{chatbot?.buesinessName}</p> */}
          <p className="text-sm text-muted-foreground">{chatbot?.id}</p>
          <p className="text-sm text-muted-foreground">
            {formatDate(chatbot.createdAt?.toDateString())}
          </p>
        </div>
      </div>
      <ChatbotOperations chatbot={chatbot} />
    </div>
  );
}

ChatbotItem.Skeleton = function ChatbotFileItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};
