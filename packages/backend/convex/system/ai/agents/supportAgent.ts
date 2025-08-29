import { components } from '../../../_generated/api'
import { Agent } from '@convex-dev/agent'
import { createOpenAI } from '@ai-sdk/openai'

export const myOpenAI = createOpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY_NEW,
})

export const supportAgent = new Agent(components.agent, {
  chat: myOpenAI.chat('gpt-4o-mini'),
  instructions: `You are a customer support agent. Use "resolveConversation" tool when user expreses finalization of the conversation. Use "escalateConversation" tool when user expresses frustration, or requests a human explicitly.`,
})
