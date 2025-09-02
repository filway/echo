import { VapiClient, Vapi } from '@vapi-ai/server-sdk'
import { internal } from '../_generated/api'
import { action } from '../_generated/server'
import { getSecretValue, parseSecretString } from '../lib/secrets'
import { ConvexError } from 'convex/values'

export const getAssistants = action({
  args: {},
  handler: async (ctx): Promise<Vapi.Assistant[]> => {
    const identity = await ctx.auth.getUserIdentity()

    if (identity === null) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
      })
    }

    const orgId = identity.orgId as string

    if (!orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Organization not found',
      })
    }

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: 'vapi',
      }
    )

    if (!plugin) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Plugin not found',
      })
    }

    const secretName = plugin.secretName
    // const secretValue = await getSecretValue(secretName)
    // const secretData = parseSecretString<{
    //   privateApiKey: string
    //   publicApiKey: string
    // }>(secretValue)

    const secretData = {
      publicApiKey: process.env.VAPI_PUBLIC_KEY,
      privateApiKey: process.env.VAPI_PRIVATE_KEY,
    }

    if (!secretData) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Credentials not found',
      })
    }

    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Credentials incomplete. Please reconnect your vapi account.',
      })
    }

    const vapiClient = new VapiClient({
      // token: process.env.VAPI_SECRET_KEY || '',
      token: secretData.privateApiKey,
    })

    const assistants = await vapiClient.assistants.list()

    return assistants
  },
})

export const getPhoneNumbers = action({
  args: {},
  handler: async (ctx): Promise<Vapi.PhoneNumbersListResponseItem[]> => {
    const identity = await ctx.auth.getUserIdentity()

    if (identity === null) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
      })
    }

    const orgId = identity.orgId as string

    if (!orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Organization not found',
      })
    }

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: 'vapi',
      }
    )

    if (!plugin) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Plugin not found',
      })
    }

    const secretName = plugin.secretName
    // const secretValue = await getSecretValue(secretName)
    // const secretData = parseSecretString<{
    //   privateApiKey: string
    //   publicApiKey: string
    // }>(secretValue)

    const secretData = {
      publicApiKey: process.env.VAPI_PUBLIC_KEY,
      privateApiKey: process.env.VAPI_PRIVATE_KEY,
    }

    if (!secretData) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Credentials not found',
      })
    }

    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Credentials incomplete. Please reconnect your vapi account.',
      })
    }

    const vapiClient = new VapiClient({
      // token: process.env.VAPI_SECRET_KEY || '',
      token: secretData.privateApiKey,
    })

    const phoneNumbers = await vapiClient.phoneNumbers.list()

    return phoneNumbers
  },
})
