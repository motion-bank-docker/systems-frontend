/* global API_HOST, STREAMER_HOST, ID_FIELD, USE_AUTH0, USE_WEBSOCKETS */
export default function () {
  return {
    apiHost: API_HOST,
    streamerHost: STREAMER_HOST,
    idField: ID_FIELD,
    useAuth0: USE_AUTH0,
    useWebSockets: USE_WEBSOCKETS
  }
}
