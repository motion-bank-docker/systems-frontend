// Configuration for your app

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'raven',
      'api',
      'auth',
      'axios',
      'conversions',
      'extractions',
      'i18n',
      'notifications',
      'pkg',
      'shortkey',
      'vocabularies',
      'window'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons'
    ],
    supportIE: true,
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        }, {
          test: /\.pug$/,
          loader: 'pug-plain-loader'
        })
      },
      // Runtime globals
      env: {
        //
        // Hosts
        //
        API_HOST: JSON.stringify(process.env.API_HOST || 'https://api.motionbank.org'),
        TRANSCODER_HOST: JSON.stringify(process.env.TRANSCODER_HOST || 'https://transcoder.motionbank.org'),
        UI_HOST: JSON.stringify(process.env.UI_HOST || 'https://app.motionbank.org'),
        //
        // Resources
        //
        TIMELINE_BASE_URI: JSON.stringify(process.env.TIMELINE_BASE_URI || 'https://app.motionbank.org/piecemaker/timelines/'),
        GRID_BASE_URI: JSON.stringify(process.env.GRID_BASE_URI || 'https://app.motionbank.org/mosys/grids/'),
        VOCABULARY_BASE_URI: JSON.stringify(process.env.VOCABULARY_BASE_URI || 'https://app.motionbank.org/piecemaker/vocabularies/'),
        ID_FIELD: JSON.stringify(process.env.ID_FIELD || 'uuid'),
        //
        // Auth0
        //
        AUTH0_DOMAIN: JSON.stringify(process.env.AUTH0_DOMAIN || 'motionbank.eu.auth0.com'),
        AUTH0_CLIENT_ID: JSON.stringify(process.env.AUTH0_CLIENT_ID || 'lyVRrHYxUCOosFip40Ws5BRJyfHWSWTi'),
        AUTH0_REDIRECT_URL: JSON.stringify(process.env.AUTH0_REDIRECT_URL || 'https://app.motionbank.org/users/callback'),
        AUTH0_AUDIENCE: JSON.stringify(process.env.AUTH0_AUDIENCE || 'https://api.motionbank.org'),
        //
        // Sentry
        //
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN || null),
        //
        // App config
        //
        IS_STAGING: JSON.stringify(process.env.IS_STAGING || false),
        UI_VERSION: JSON.stringify(process.env.UI_VERSION || require('./package.json').version)
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      host: '0.0.0.0',
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        //
        // Layout
        //
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QWindowResizeObservable',
        'QPageSticky',
        //
        // Buttons
        //
        'QBtn',
        'QBtnDropdown',
        //
        // Navigation
        //
        'QToolbar',
        'QToolbarTitle',
        'QContextMenu',
        'QTabs',
        'QTab',
        'QTabPane',
        'QRouteTab',
        //
        // Form Components
        //
        'QSelect',
        'QInput',
        'QField',
        'QCheckbox',
        'QRadio',
        'QSlider',
        'QToggle',
        'QChipsInput',
        'QSearch',
        'QDatetimePicker',
        'QDatetime',
        //
        // Grouping
        //
        'QCard',
        'QCardSeparator',
        'QCardMain',
        'QCollapsible',
        'QTable',
        'QTr',
        'QTd',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QItemTile',
        'QItemSeparator',
        //
        // Popups
        //
        'QModal',
        'QModalLayout',
        'QTooltip',
        'QPopover',
        //
        // Progress
        //
        'QSpinner',
        'QSpinnerTail',
        'QSpinnerPuff',
        //
        // Scrolling
        //
        'QScrollArea',
        //
        // Other Components
        //
        'QIcon',
        'QChip',
        'QUploader'
      ],
      directives: [
        'Ripple',
        'Scroll',
        'TouchHold'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Dialog',
        'Loading',
        'ActionSheet'
      ]
    },
    animations: 'all',
    pwa: {
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#1f1d1e', // bg from common.variables.styl
        theme_color: '#729BFF', // primary from common.variables.styl
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack (cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.3'
  }
}
