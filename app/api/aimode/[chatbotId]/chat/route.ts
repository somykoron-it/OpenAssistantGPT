import fetch from 'node-fetch';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { chatbotSchema } from '@/lib/validations/chatbot';
import { getServerSession } from 'next-auth';
import OpenAI from 'openai';
import { z } from 'zod';

export const maxDuration = 300;

const routeContextSchema = z.object({
  params: z.object({
    chatbotId: z.string(),
  }),
});

async function verifyCurrentUserHasAccessToChatbot(chatbotId: string) {
  const session = await getServerSession(authOptions);

  const count = await db.aIMode.count({
    where: {
      id: chatbotId,
      userId: session?.user?.id,
    },
  });

  return count > 0;
}

interface RequestBody {
  role: string[];
  content: string[];
}

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const { params } = routeContextSchema.parse(context);

  if (!(await verifyCurrentUserHasAccessToChatbot(params.chatbotId))) {
    return new Response(null, { status: 403 });
  }

  try {
    const chatbot = await db.aIMode.findFirst({
      select: {
        id: true,
        prompt: true,
        businessContext: true,
      },
      where: {
        id: params.chatbotId,
      },
    });

    console.log('=======This==========');
    console.log(chatbot);

    const actualPrompt = `
      ${chatbot?.prompt}

      I will be providing you with the context enclosed by triple backslash, from which you have to answer. If you don't know the answer and it's not provided in the context, just say you don't know.

      \`\`\`
      ${chatbot?.businessContext}
      \`\`\`
    `;
    return new Response(JSON.stringify(actualPrompt));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { role, content, actualPrompt } = await req.json();

    const data = {
      key: 'r96192m5289m4AYinKBGhpLOEdIH9Q7v5jgjdd8z6sNhfsx6VIovCvtrXbPa',
      messages: [
        {
          role: 'system',
          content: actualPrompt,
        },
        ...content.map((message: any, index: any) => ({
          role: role[index],
          content: message,
        })),
      ],
      max_tokens: 512,
      // model_id : 'openchat_3.5',
    };

    const response = await fetch(
      'https://modelslab.com/api/v6/llm/uncensored_chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log(responseData);
    return new Response(JSON.stringify(responseData.message));
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process' }), {
      status: 500,
    });
  }
}
