import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getMany = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect()
    return users
  },
})
