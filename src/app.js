const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')
const fetch = require('node-fetch');

const app = new Koa()
const router = new Router()

const token = {
  "token_type": "bearer",
  "access_token": "AAAAAAAAAAAAAAAAAAAAAIu79AAAAAAAO7JaVKQmZdRXeG%2BWaqLwmrMbRr4%3DMPoL9ERgHRkOSjsZzT4VHCyZIJnE176qr1fANKSJMyRMLxo5yj",
}

const authRequest = async () => {
  const credentials = `AexrALfqykM5y1WnKD2eMHcNc:3SgzUurKaGhd1gC6JlA8LJLQ3bOslExIYRk51WdxfaNXHNdwBN`
  const credentialsBase64Encoded = new Buffer(credentials).toString('base64');

  const uri = 'https://api.twitter.com/oauth2/token'
  const options = {
    headers: {
      'Authorization': `Basic ${credentialsBase64Encoded}`,
      'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
    },
    method: 'POST',
    body: 'grant_type=client_credentials',
    json: true
  }

  const response = await fetch(uri, options)
  
  return response.json()
}

const getUserTimelineRequest = async () => {
  const uri = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=augustoeml&count=50'
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
    },
    json: true,
  }

  const response = await fetch(uri, options)

  return response.json()
}

router.get('/', async (ctx, next) => {
  ctx.body = await getUserTimelineRequest()
  ctx.headers = {
    'Access-Control-Allow-Origin': '*',
  }

  await next()
})

app.use(cors())
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(4000)
