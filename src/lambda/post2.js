const fetch = require('node-fetch')
const slackURL = process.env.SLACK_WEBHOOK_URL

export async function handler(event, context, callback) {
  if (!url) {
    callback(null, {
      statusCode: 400,
      body: 'Bad request'
    })
  }
  if (event.httpMethod !== 'POST') {
    return callback(null, {
      statusCode: 410,
      body: 'Unsupported Request Method'
    })
  }
  try {
    const { url, title } = event.queryStringParameters
    const payload = JSON.parse(event.body)
    const request = await fetch(slackURL, {
      method: 'POST',
      body: JSON.stringify({
        username: 'mjs',
        icon_emoji: ':javascript:',
        text: `I\'m just published. <${decodeURI(url)}|${title || 'detail'}>\nDEBUG:\nurl=>${url}\ntitle=>${title}`
      })
    })
    callback(null, {
      statusCode: 204
    })
  } catch (e) {
    callback(null, {
      statusCode: 500,
      body: 'Internal Server Error: ' + e
    })
  } 
}