const
  pkg = require('../../package.json'),
  jwtDecode = require('jwt-decode'),
  request = require('request'),
  url = require('url'),
  keytar = require('keytar'),
  os = require('os')

const
  redirectUri = 'file:///callback',
  keytarService = `${pkg.name}${process.env.BUILD_NAME_EXT
    ? `-${process.env.BUILD_NAME_EXT.replace(/\s+/g, '_').toLocaleLowerCase()}` : ''}-openid-oauth`,
  keytarAccount = os.userInfo().username

function getAuthenticationURL () {
  return 'https://' + process.env.AUTH0_DOMAIN + '/authorize?' +
    'audience=' + process.env.AUTH0_AUDIENCE + '&' +
    'scope=openid profile offline_access&' +
    'response_type=code&' +
    'client_id=' + process.env.AUTH0_CLIENT_ID + '&' +
    'redirect_uri=' + redirectUri
}

function refreshTokens () {
  return new Promise(async (resolve, reject) => {
    const refreshToken = await keytar.getPassword(keytarService, keytarAccount)
    if (!refreshToken) return reject(new Error('No refresh token found'))

    const refreshOptions = {
      method: 'POST',
      url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      headers: {'content-type': 'application/json'},
      body: {
        grant_type: 'refresh_token',
        client_id: process.env.AUTH0_CLIENT_ID,
        refresh_token: refreshToken
      },
      json: true
    }

    request(refreshOptions, async function (error, response, body) {
      if (error || body.error) {
        await logout()
        return reject(error || body.error)
      }

      global.accessToken  = body.access_token
      global.profile = jwtDecode(body.id_token)

      resolve()
    })
  })
}

function loadTokens (callbackURL) {
  return new Promise((resolve, reject) => {
    const urlParts = url.parse(callbackURL, true)
    const query = urlParts.query

    const exchangeOptions = {
      'grant_type': 'authorization_code',
      'client_id': process.env.AUTH0_CLIENT_ID,
      'code': query.code,
      'redirect_uri': redirectUri
    }

    const options = {
      method: 'POST',
      url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(exchangeOptions)
    }

    request(options, async (error, resp, body) => {
      if (error || body.error) {
        await logout()
        return reject(error || body.error)
      }

      const responseBody = JSON.parse(body)
      global.accessToken = responseBody.access_token
      global.profile = jwtDecode(responseBody.id_token)
      const refreshToken = responseBody.refresh_token

      keytar.setPassword(keytarService, keytarAccount, refreshToken)

      resolve()
    })
  })
}

async function logout () {
  await keytar.deletePassword(keytarService, keytarAccount)
}

function getLogOutUrl () {
  return `https://${process.env.AUTH0_DOMAIN}/v2/logout`
}

export {
  getAuthenticationURL,
  getLogOutUrl,
  loadTokens,
  logout,
  refreshTokens
}
