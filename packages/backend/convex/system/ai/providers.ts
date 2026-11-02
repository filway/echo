import { createOpenAI } from '@ai-sdk/openai'

// These clients use separate credentials and endpoints. Only the OpenAI client
// is used for RAG embeddings; all generated text uses DeepSeek.
export const openAIEmbeddings = createOpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY_NEW,
})

const deepSeek = createOpenAI({
  // Convex imports modules while analyzing a deployment, before function
  // environment variables are available. Validate them when a request runs.
  baseURL: process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || 'missing-deepseek-api-key',
  fetch: (input, init) => {
    if (!process.env.DEEPSEEK_API_BASE_URL || !process.env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_BASE_URL and DEEPSEEK_API_KEY must be set')
    }
    return fetch(input, init)
  },
})

export const deepSeekChat = deepSeek.chat(
  process.env.DEEPSEEK_MODEL || 'deepseek-flash'
)
