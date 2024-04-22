import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { db } from "@/lib/db"
import { chatbotSchema } from "@/lib/validations/chatbot";
import OpenAI from "openai";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { RequiresHigherPlanError } from "@/lib/exceptions";

export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const chatbots = await db.chatbot.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      where: {
        userId: user?.id,
      },
    })

    return new Response(JSON.stringify(chatbots))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    // Validate user subscription plan
    const { user } = session
    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    const count = await db.chatbot.count({
      where: {
        userId: user.id,
      },
    })

    // if (count >= subscriptionPlan.maxChatbots) {
    //   throw new RequiresHigherPlanError()
    // }

    const json = await req.json()
    const body = chatbotSchema.parse(json)

    const model = await db.chatbotModel.findUnique({
      where: {
        id: body.modelId
      }
    })

    if (!model) {
      return new Response("Invalid Model", { status: 400 })
    }

    const openAIConfig = await db.openAIConfig.findUnique({
      select: {
        globalAPIKey: true,
        id: true,
      },
      where: {
        userId: session?.user?.id
      }
    })

    if (!openAIConfig?.globalAPIKey) {
      return new Response("Missing your global OpenAI API key, please configure your account.", { status: 400 })
    }

    const openai = new OpenAI({
      apiKey: openAIConfig?.globalAPIKey
    })

    const files = await db.file.findMany({
      select: {
        id: true,
        openAIFileId: true,
      },
      where: {
        id: {
          in: body.files
        },
      },
    })

    if (!files) {
      return new Response("Invalid files", { status: 400 })
    }

    try {
      const openaiTest = new OpenAI({
        apiKey: body.openAIKey
      })
      await openaiTest.models.list()
    } catch (error) {
      return new Response("Invalid OpenAI API key", { status: 400, statusText: "Invalid OpenAI API key" })
    }

    const createdChatbot = await openai.beta.assistants.create({
      name: body.name,
      instructions: body.prompt,
      model: model.name,
      tools: [{ type: "retrieval" }],
      file_ids: files.map((file) => file.openAIFileId),
    })

    const chatbot = await db.chatbot.create({
      data: {
        name: body.name,
        prompt: body.prompt,
        openaiKey: body.openAIKey,
        openaiId: createdChatbot.id,
        modelId: model.id,
        userId: user?.id,
        welcomeMessage: body.welcomeMessage,
      },
      select: {
        id: true,
      },
    })

    await db.chatbotFiles.createMany(
      {
        data: files.map((file) => ({
          chatbotId: chatbot.id,
          fileId: file.id,
        })),
      }
    )

    return new Response(JSON.stringify({ chatbot }))
  } catch (error) {
    console.log(error)

    if (error instanceof RequiresHigherPlanError) {
      return new Response("Upgrade to higher plan", { status: 402 })
    }

    return new Response(null, { status: 500 })
  }
}
