module.exports = (ctx) => {
  const {
    query,
    request: {
      body
    }
  } = ctx
  const id = ctx.cookies.get('userid')
  const token = ctx.headers.token
  return { query, body, id, token }
}
