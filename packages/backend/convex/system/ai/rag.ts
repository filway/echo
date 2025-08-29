import { RAG } from '@convex-dev/rag'
import { components } from '../../_generated/api'
import { myOpenAI } from './agents/supportAgent'

const rag = new RAG(components.rag, {
  textEmbeddingModel: myOpenAI.embedding('text-embedding-3-small'),
  embeddingDimension: 1536,
})

export default rag
