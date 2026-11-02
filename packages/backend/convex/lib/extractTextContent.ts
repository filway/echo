import { generateText } from 'ai'
import type { StorageActionWriter } from 'convex/server'
import { assert } from 'convex-helpers'
import { deepSeekChat } from '../system/ai/providers'
import { Id } from '../_generated/dataModel'

const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const

const SYSTEM_PROMPTS = {
  image:
    'You turn images into text. If it is a photo of a document, transcribe it. If it is not a document, describe it.',
  html: 'You transform content into markdown.',
}

export type ExtractTextContentArgs = {
  storageId: Id<'_storage'>
  filename: string
  bytes?: ArrayBuffer
  mimeType: string
}

export async function extractTextContent(
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs
): Promise<string> {
  const { storageId, bytes, mimeType } = args

  if (SUPPORTED_IMAGE_TYPES.some((type) => type === mimeType)) {
    const url = await ctx.storage.getUrl(storageId)
    assert(url, 'Failed to get storage URL')
    return extractImageText(url)
  }

  if (mimeType.toLowerCase().includes('text')) {
    return extractTextFileContent(ctx, storageId, bytes, mimeType)
  }

  throw new Error(`Unsupported mime type: ${mimeType}`)
}

async function extractImageText(url: string): Promise<string> {
  const result = await generateText({
    model: deepSeekChat,
    system: SYSTEM_PROMPTS.image,
    messages: [
      {
        role: 'user',
        content: [{ type: 'image', image: new URL(url) }],
      },
    ],
  })

  return result.text
}

async function extractTextFileContent(
  ctx: { storage: StorageActionWriter },
  storageId: Id<'_storage'>,
  bytes: ArrayBuffer | undefined,
  mimeType: string
): Promise<string> {
  const arrayBuffer =
    bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer())

  if (!arrayBuffer) {
    throw new Error('Failed to get file content')
  }

  const text = new TextDecoder().decode(arrayBuffer)

  if (mimeType.toLowerCase() !== 'text/plain') {
    const result = await generateText({
      model: deepSeekChat,
      system: SYSTEM_PROMPTS.html,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text },
            {
              type: 'text',
              text: "Extract the text and print it in a markdown format without explaining that you'll do so.",
            },
          ],
        },
      ],
    })

    return result.text
  }

  return text
}
