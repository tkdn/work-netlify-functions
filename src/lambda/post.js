const https = require('https')
const url = require('url')
const slackUrl = process.env.SLACK_WEBHOOK_URL
const slackReqOptions = url.parse(slackUrl)
slackReqOptions.method = 'POST'
slackReqOptions.headers = {'Content-Type': 'application/json'}

exports.handler = async (event, context) => {
  const { url, title } = event.queryStringParameters

  if (url) {
    const req = https.request(slackReqOptions, res => {
      if (res.statusCode === 200) {
        console.log('posted to slack')
      } else {
        throw new Error('status code: ' + res.statusCode)
      }
    })
    // error handle
    req.on('error', e => {
      console.log('problem with request: ' + e.message)
      throw new Error(e.message)
    })
    // request send
    req.write(JSON.stringify({
      username: 'mjs',
      icon_emoji: ':javascript:',
      text: `I\'m just published. <${decodeURI(url)}|${title || 'detail'}>\nDEBUG:\nurl=>${url}\ntitle=>${title}`
    }))
    // request end
    req.end()
    // response
    return {
      statusCode: 200,
      body: `${title} - ${url} done.\nSLACK_WEBHOOK_URL: ${slackUrl}`
    }
  } else {
    return {
      statusCode: 403
    }
  }
}

