const userHasFeature = (user, feature) => {
  let features = []
  try {
    features = user[`${process.env.AUTH0_APP_METADATA_PREFIX}features`]
  }
  catch (err) { /* ignored */ }
  if (!features) return false

  if (features.indexOf('*') !== -1) return true
  if (features.indexOf(feature) !== -1) return true

  return false
}

export default userHasFeature
