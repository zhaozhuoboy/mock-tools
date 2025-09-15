import { defineEventHandler } from "h3"

export default defineEventHandler(async (event) => {
  console.log('== log middleware ==')
  console.log(`${event.method}:${event.node.req.url}`)
})
