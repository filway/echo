import { RAG } from '@convex-dev/rag'
import { components } from '../../_generated/api'
import { openAIEmbeddings } from './providers'

const rag = new RAG(components.rag, {
  textEmbeddingModel: openAIEmbeddings.embedding('text-embedding-3-small'),
  embeddingDimension: 1536,
})

export default rag
