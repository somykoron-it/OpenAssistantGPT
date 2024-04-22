'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import { AiModeSchema, chatbotSchema } from '@/lib/validations/chatbot';
import { ChatbotModel, File, User } from '@prisma/client';
import Select from 'react-select';

type FormData = z.infer<typeof AiModeSchema>;

interface NewChatbotProps extends React.HTMLAttributes<HTMLElement> {
  isOnboarding: boolean;
  user: Pick<User, 'id'>;
}

export function NewChatbotForm({
  isOnboarding,
  className,
  ...props
}: NewChatbotProps) {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(AiModeSchema),
    defaultValues: {
      welcomeMessage: 'Hello, how can I help you?',
      prompt:
        'You are an assistant you help users to answers basic information about our business based on the context provided.',
      context: '',
    },
  });

  const [models, setModels] = useState<ChatbotModel[]>([]);
  const [availablesModels, setAvailablesModels] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      const response = await fetch('/api/models', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const models = await response.json();
      setModels(models);

      const supportedModels = await getAvailableModels();
      setAvailablesModels(supportedModels);

      const filesResponse = await getFiles();
      setFiles(filesResponse);
    };
    init();
  }, []);

  async function getFiles() {
    const response = await fetch('/api/files', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const files = await response.json();
    return files;
  }

  async function getAvailableModels() {
    const response = await fetch(`/api/users/${props.user.id}/openai/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const models = await response.json();
    return models;
  }

  async function onSubmit(data: FormData) {
    setIsSaving(true);
    console.log(data);

    const response = await fetch(`/api/aimode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //   body: JSON.stringify({
      //     name: data.name,
      //     prompt: data.prompt,
      //     openAIKey: data.openAIKey,
      //     welcomeMessage: data.welcomeMessage,
      //     modelId: data.modelId,
      //     files: data.files,
      //   }),
      body: JSON.stringify({
        userId: props.user.id,
        buesinessName: data.name,
        prompt: data.prompt,
        welcomeMessage: data.welcomeMessage,
        businessContext: data.context,
      }),
    });

    setIsSaving(false);

    if (!response?.ok) {
      if (response.status === 400) {
        return toast({
          title: 'Something went wrong.',
          description: await response.text(),
          variant: 'destructive',
        });
      } else if (response.status === 402) {
        return toast({
          title: 'Chatbot limit reached.',
          description: 'Please upgrade to the a higher plan.',
          variant: 'destructive',
        });
      }
      return toast({
        title: 'Something went wrong.',
        description: 'Your chatbot was not saved. Please try again.',
        variant: 'destructive',
      });
    }

    toast({
      description: 'Your chatbot has been saved.',
    });

    router.refresh();
    if (!isOnboarding) {
      router.push('/dashboard/aimode');
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Create new Chatbot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Business Name</FormLabel>
                  <Input onChange={field.onChange} id="name" />
                  <FormDescription>
                    Please enter the name of the business you are building the
                    bot for. For example: Google.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="welcomeMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="welcomemessage">
                    Welcome message
                  </FormLabel>
                  <Input
                    onChange={field.onChange}
                    value={field.value}
                    id="welcomemessage"
                  />
                  <FormDescription>
                    Please provide the welcome message that will be sent to the
                    user when they start a conversation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="prompt">System Prompt</FormLabel>
                  <Input
                    onChange={field.onChange}
                    value={field.value}
                    id="prompt"
                  />
                  <FormDescription>
                    Please enter the prompt or instruction that the chatbot will
                    follow based on the context provided.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="context">Buesiness Context</FormLabel>
                  <Textarea
                    onChange={field.onChange}
                    value={field.value}
                    id="context"
                  />
                  <FormDescription>
                    Please enter all the information about the business you want
                    the bot to be able to answer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="modelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="modelId">OpenAI Model</FormLabel>
                  <Select
                    onChange={(value) => field.onChange(value.value)}
                    defaultValue={field.value}
                    id="modelId"
                    options={models
                      .filter((model: ChatbotModel) =>
                        availablesModels.includes(model.name)
                      )
                      .map((model: ChatbotModel) => ({
                        value: model.id,
                        label: model.name,
                      }))}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                  <FormDescription>
                    The OpenAI model that will be used to generate responses.
                    <b>
                      {' '}
                      If you don&apos;t have the gpt-4 option and want to use
                      it. You need to have an OpenAI account at least tier 1.
                    </b>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            {/* <FormField
              control={form.control}
              name="openAIKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="openAIKey">OpenAI API Key</FormLabel>
                  <Input
                    onChange={field.onChange}
                    id="openAIKey"
                    type="password"
                  />
                  
                  <FormDescription>
                    The OpenAI API key that will be used to generate responses
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </CardContent>
          <CardFooter>
            <button
              type="submit"
              className={cn(buttonVariants(), className)}
              disabled={isSaving}
            >
              {isSaving && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>Create</span>
            </button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
