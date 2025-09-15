import { defineEventHandler } from "h3"

export default defineEventHandler(async event => {
  event.context.auth = {uid: 123, name: 'xxx'}
})