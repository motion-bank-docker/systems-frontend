// Configuration for your app
const pkg = require('./package.json')

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'raven',
      'api',
      'auth',
      'axios',
      'components',
      'handle-error',
      'i18n',
      'notifications',
      'pkg',
      'shortkey',
      'sort',
      'socket',
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
        cfg.externals = Object.assign({
          nedb: 'commonjs nedb',
          'ffprobe-static': 'commonjs ffprobe-static',
          'jwt-decode': 'commonjs jwt-decode',
          'fluent-ffmpeg': 'commonjs fluent-ffmpeg',
          'open-graph-scraper': 'commonjs open-graph-scraper',
          'mbjs-archive': 'commonjs mbjs-archive'
        }, cfg.externals)
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
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        //
        // Hosts
        //
        API_HOST: JSON.stringify(process.env.API_HOST || 'https://api.motionbank.org'),
        SOCKETS_HOST: JSON.stringify(process.env.SOCKETS_HOST || 'https://sockets.motionbank.org'),
        STORAGE_HOST: JSON.stringify(process.env.STORAGE_HOST || 'https://storage.motionbank.org'),
        PACKAGER_HOST: JSON.stringify(process.env.PACKAGER_HOST || 'https://packager.motionbank.org'),
        TRANSCODER_HOST: JSON.stringify(process.env.TRANSCODER_HOST || 'https://transcoder.motionbank.org'),
        UI_HOST: JSON.stringify(process.env.UI_HOST || 'https://app.motionbank.org'),
        //
        // Resources
        //
        VOCABULARY_BASE_URI: JSON.stringify(process.env.VOCABULARY_BASE_URI || 'http://id.motionbank.org/vocabularies/'),
        AUTH0_APP_METADATA_PREFIX: JSON.stringify(process.env.AUTH0_APP_METADATA_PREFIX || 'https://app.motionbank.org/app_metadata/'),
        ID_FIELD: JSON.stringify(process.env.ID_FIELD || '_uuid'),
        //
        // Auth0
        //
        AUTH0_DOMAIN: JSON.stringify(process.env.AUTH0_DOMAIN || 'auth.motionbank.org'),
        AUTH0_CLIENT_ID: JSON.stringify(process.env.AUTH0_CLIENT_ID || '80t5TRU9MVhGDVnZ522CvX4hutBxDB6U'),
        AUTH0_REDIRECT_URL: JSON.stringify(process.env.AUTH0_REDIRECT_URL || 'https://app.motionbank.org/users/callback'),
        AUTH0_AUDIENCE: JSON.stringify(process.env.AUTH0_AUDIENCE || 'https://api.motionbank.org'),
        //
        // API Keys
        //
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN || null),
        YOUTUBE_API_KEY: JSON.stringify(process.env.YOUTUBE_API_KEY || null),
        VIMEO_ACCESS_TOKEN: JSON.stringify(process.env.VIMEO_ACCESS_TOKEN || null),
        //
        // App config
        //
        IS_STAGING: JSON.stringify(process.env.IS_STAGING || false),
        IS_ELECTRON: JSON.stringify(process.env.IS_ELECTRON || false),
        BUILD_NAME_EXT: JSON.stringify(process.env.BUILD_NAME_EXT || null),
        USE_RESOURCE_CACHE: JSON.stringify(process.env.USE_RESOURCE_CACHE || false),
        UI_VERSION: JSON.stringify(process.env.UI_VERSION || require('./package.json').version),
        FLUENTFFMPEG_COV: JSON.stringify(false)
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
        // 'QPage',
        'QWindowResizeObservable',
        'QResizeObservable',
        'QPageSticky',
        //
        // Buttons
        //
        'QBtn',
        // 'QBtnToggle',
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
        'QBreadcrumbs',
        'QBreadcrumbsEl',
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
        'QAutocomplete',
        'QOptionGroup',
        //
        // Grouping
        //
        'QCard',
        'QCardActions',
        'QCardSeparator',
        'QCardTitle',
        'QCardMain',
        'QCollapsible',
        'QTable',
        'QTr',
        'QTd',
        'QTree',
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
        // 'QSpinnerTail',
        'QSpinnerPuff',
        //
        // Scrolling
        //
        // 'QScrollArea',
        //
        // Other Components
        //
        'QIcon',
        'QChip',
        'QUploader',
        'QEditor'
      ],
      directives: [
        'Ripple',
        'Scroll',
        'TouchHold',
        'TouchPan',
        'CloseOverlay'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Dialog',
        'Loading',
        'ActionSheet',
        'Screen'
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
      bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        cfg.externals = Object.assign({
          keytar: 'commonjs keytar'
        }, cfg.externals)
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        appId: `org.motionbank.${pkg.name}${process.env.BUILD_NAME_EXT ? `-${process.env.BUILD_NAME_EXT.toLocaleLowerCase()}` : ''}`,
        productName: `Motion Bank Systems${process.env.BUILD_NAME_EXT ? ` (${process.env.BUILD_NAME_EXT})` : ''}`,
        copyright: '2019 Motion Bank',
        asarUnpack: [
          // '**/app/node_modules/ffmpeg-static/*',
          '**/app/node_modules/ffprobe-static/*'
        ],
        mac: {
          category: 'public.app-category.education',
          target: 'dmg'
        }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.3'
  }
}
