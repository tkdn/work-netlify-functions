import fetch from 'node-fetch'

const slackURL = process.env.SLACK_WEBHOOK_URL

exports.handler = (event, context, callback) => {
  // Bad Method
  if (event.httpMethod !== 'POST') {
    return callback(null, {
      statusCode: 410,
      body: 'Unsupported Request Method'
    })
  }
  // Bad Content-Type
  if (event.headers['content-type'] !== 'application/x-www-form-urlencoded') {
    return {
      statusCode: 422,
      body: 'Invalid content type. Only application/x-www-form-urlencoded is supported'
    }
  }
  try {
    const { url, title } = parseQueryString(event.body)
    if (!url && !title) {
      callback(null, {
        statusCode: 400,
        body: 'Bad request'
      })
    }
    fetch(slackURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'mjs',
        icon_emoji: ':javascript:',
        text: `I\'m just published. <${decodeURIComponent(url)}|${title || 'detail'}>`
      })
    }).then(()=>{
      callback(null, {
        statusCode: 204
      })
    })
  } catch (e) {
    callback(null, {
      statusCode: 500,
      body: 'Internal Server Error: ' + e
    })
  } 
}

function parseQueryString(queryString) {
  return queryString
    .split('&')
    .map(param => {
      const [key, value] = param.split('=')
      return { key, value }
    })
    .reduce((params, { key, value }) => {
      params[key] = value
      return params
    }, {})
}

