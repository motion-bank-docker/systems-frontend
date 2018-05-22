/**
 * Scope configurations
 * for different groups
 */
const Scopes = function () {
  /** Config getter */
  return {
    config: {
      /**
       * User scope matrix
       */
      user: {
        find:
          { maps: 'public,own', annotations: 'public,own', acls: 'own' },
        get:
          { maps: 'public,own', users: 'public,own', annotations: 'public,own', acls: 'own' },
        create:
          { maps: true, users: true, annotations: true, acls: 'own' },
        update:
          { maps: 'own', users: 'own', annotations: 'own', acls: 'own' },
        patch:
          { maps: 'own', users: 'own', annotations: 'own', acls: 'own' },
        remove:
          { maps: 'own', users: 'own', annotations: 'own', acls: 'own' }
      }
    },
    isUserAllowed (action, resource, fine = 'own') {
      const user = Scopes.config.user
      return user[action] && user[action][resource] &&
        (user[action][resource] === true || user[action][resource].indexOf(fine) > -1)
    }
  }
}

const { config, isUserAllowed } = Scopes()
module.exports = {
  config,
  isUserAllowed
}
