const
  pkg = require('../../package.json'),
  jwtDecode = require('jwt-decode'),
  axios = require('axios'),
  url = require('url'),
  keytar = require('keytar'),
  os = require('os')

const
  redirectUri = 'file:///callback',
  keytarService = `${pkg.name}${process.env.BUILD_NAME_EXT
    ? `-${process.env.BUILD_NAME_EXT.replace(/\s+/g, '_').toLocaleLowerCase()}` : ''}-openid-oauth`,
  keytarAccount = os.userInfo().username

function getAuthenticationURL () {
  return 'https://' + (window.AUTH0_DOMAIN || process.env.AUTH0_DOMAIN) + '/authorize?' +
    'audience=' + (window.AUTH0_AUDIENCE || process.env.AUTH0_AUDIENCE) + '&' +
    'scope=openid profile offline_access&' +
    'response_type=code&' +
    'client_id=' + (window.AUTH0_CLIENT_ID || process.env.AUTH0_CLIENT_ID) + '&' +
    'redirect_uri=' + redirectUri
}

async function refreshTokens () {
  const refreshToken = await keytar.getPassword(keytarService, keytarAccount)
  if (!refreshToken) return throw new Error('No refresh token found')

  const result = await axios.post(`https://${window.AUTH0_DOMAIN || process.env.AUTH0_DOMAIN}/oauth/token`, {
    grant_type: 'refresh_token',
    client_id: window.AUTH0_CLIENT_ID || process.env.AUTH0_CLIENT_ID,
    refresh_token: refreshToken
  }, {
    headers: {'Content-Type': 'application/json'}
  })

  global.accessToken = result.data.access_token
  global.profile = jwtDecode(result.data.id_token)
}

async function loadTokens (callbackURL) {
  const urlParts = url.parse(callbackURL, true)
  const query = urlParts.query

  const exchangeOptions = {
    'grant_type': 'authorization_code',
    'client_id': window.AUTH0_CLIENT_ID || process.env.AUTH0_CLIENT_ID,
    'code': query.code,
    'redirect_uri': redirectUri
  }

  const result = await axios.post(`https://${window.AUTH0_DOMAIN || process.env.AUTH0_DOMAIN}/oauth/token`, exchangeOptions, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  global.accessToken = result.data.access_token
  global.profile = jwtDecode(result.data.id_token)
  const refreshToken = result.data.refresh_token

  keytar.setPassword(keytarService, keytarAccount, refreshToken)
}

async function logout () {
  await keytar.deletePassword(keytarService, keytarAccount)
}

function getLogOutUrl () {
  return `https://${window.AUTH0_DOMAIN || process.env.AUTH0_DOMAIN}/v2/logout`
}

export {
  getAuthenticationURL,
  getLogOutUrl,
  loadTokens,
  logout,
  refreshTokens
}
