import * as z from "zod"

export const chatbotSchema = z.object({
    name: z.string().min(3).max(50),
    openAIKey: z.string().min(1),
    prompt: z.string().min(1),
    welcomeMessage: z.string().min(1),
    modelId: z.string().min(1),
    files: z.array(z.string()),
})


export const AiModeSchema = z.object({
    name: z.string().min(3).max(50),
    prompt: z.string().min(1),
    welcomeMessage: z.string().min(1),
    context: z.string().min(1),
})
