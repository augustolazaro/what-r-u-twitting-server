require('dotenv').config()

const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')
const fetch = require('node-fetch')

const app = new Koa()
const router = new Router()

const authRequest = async () => {
  const credentials = `${process.env.API_KEY}:${process.env.API_SECRET_KEY}`
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
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
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
