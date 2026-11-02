'use node'

import { v } from 'convex/values'
import { extractText, getDocumentProxy } from 'unpdf'
import { internalAction } from '../_generated/server'

export const extractTextFromPdf = internalAction({
  args: { bytes: v.bytes() },
  handler: async (_ctx, { bytes }): Promise<string> => {
    const pdf = await getDocumentProxy(new Uint8Array(bytes))
    try {
      const { text } = await extractText(pdf, { mergePages: true })
      if (!text.trim()) {
        throw new Error('PDF has no selectable text; scanned PDFs need OCR before upload')
      }
      return text
    } finally {
      await pdf.destroy()
    }
  },
})
