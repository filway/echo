import { components } from '../../../_generated/api'
import { Agent } from '@convex-dev/agent'
import { SUPPORT_AGENT_PROMPT } from '../constants'
import { deepSeekChat } from '../providers'

export const supportAgent = new Agent(components.agent, {
  chat: deepSeekChat,
  instructions: SUPPORT_AGENT_PROMPT,
})
