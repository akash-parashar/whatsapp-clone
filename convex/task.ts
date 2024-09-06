import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTasks = query({
  args: {},
    // @ts-ignore
    handler: async (ctx, args) => {
      const tasks = await ctx.db.query("tasks").collect();
      return tasks;
    },
  },
);

export const addTask = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      completed: false,
    });
    return taskId;
  },
});
