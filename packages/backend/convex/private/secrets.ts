import { ConvexError, v } from 'convex/values'
import { mutation } from '../_generated/server'
import { internal } from '../_generated/api'

export const upsert = mutation({
  args: {
    service: v.union(v.literal('vapi')),
    value: v.any(),
  },
  handler: async (ctx, args) => {
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

    // TODO: Check for subscription
    await ctx.scheduler.runAfter(0, internal.system.secrets.upsert, {
      organizationId: orgId,
      service: args.service,
      value: args.value,
    })
  },
})
