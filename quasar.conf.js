// Configuration for your app
const pkg = require('./package.json')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')

// get git info from command line
const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString().trim()
const branchName = require('child_process')
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString().trim()

const getVersion = function () {
  if (process.env.BUILD_NAME_EXT) {
    return `v${pkg.version}-${process.env.BUILD_NAME_EXT}-${commitHash}`
  }
  return `v${pkg.version}-${commitHash}`
}

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'sentry',
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
      'touch',
      'vocabularies',
      'window',
      'intersection-observer'
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
        if (process.env.SENTRY_AUTH_TOKEN) {
          cfg.plugins.push(
            new SentryWebpackPlugin({
              include: '.',
              ignore: [
                'dist',
                'node_modules',
                'webpack.config.js',
                'quasar.conf.js',
                '.eslintrc.js',
                '.postcssrc.js'
              ],
              configFile: 'sentry.properties',
              release: getVersion()
            })
          )
        }
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
        API_HOST: JSON.stringify(process.env.API_HOST),
        SOCKETS_HOST: JSON.stringify(process.env.SOCKETS_HOST),
        STORAGE_HOST: JSON.stringify(process.env.STORAGE_HOST),
        PACKAGER_HOST: JSON.stringify(process.env.PACKAGER_HOST),
        TRANSCODER_HOST: JSON.stringify(process.env.TRANSCODER_HOST),
        //
        // Resources
        //
        VOCABULARY_BASE_URI: JSON.stringify(process.env.VOCABULARY_BASE_URI || 'http://id.motionbank.org/vocabularies/'),
        AUTH0_APP_METADATA_PREFIX: JSON.stringify(process.env.AUTH0_APP_METADATA_PREFIX || 'https://app.motionbank.org/app_metadata/'),
        ID_FIELD: JSON.stringify(process.env.ID_FIELD || '_uuid'),
        //
        // Auth0
        //
        AUTH0_DOMAIN: JSON.stringify(process.env.AUTH0_DOMAIN),
        AUTH0_CLIENT_ID: JSON.stringify(process.env.AUTH0_CLIENT_ID),
        AUTH0_REDIRECT_URL: JSON.stringify(process.env.AUTH0_REDIRECT_URL),
        AUTH0_AUDIENCE: JSON.stringify(process.env.AUTH0_AUDIENCE),
        //
        // General OAuth2
        //
        OAUTH_CLIENT_ID: JSON.stringify(process.env.OAUTH_CLIENT_ID),
        OAUTH_CLIENT_SECRET: JSON.stringify(process.env.OAUTH_CLIENT_SECRET),
        OAUTH_REDIRECT_URL: JSON.stringify(process.env.OAUTH_REDIRECT_URL),
        OAUTH_AUTH_URL: JSON.stringify(process.env.OAUTH_AUTH_URL),
        OAUTH_TOKEN_URL: JSON.stringify(process.env.OAUTH_TOKEN_URL),
        OAUTH_EDIT_PROFILE_URL: JSON.stringify(process.env.OAUTH_EDIT_PROFILE_URL),
        //
        // API Keys
        //
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
        YOUTUBE_API_KEY: JSON.stringify(process.env.YOUTUBE_API_KEYl),
        VIMEO_ACCESS_TOKEN: JSON.stringify(process.env.VIMEO_ACCESS_TOKEN),
        //
        // App config
        //
        IS_STAGING: JSON.stringify(process.env.IS_STAGING || false),
        IS_ELECTRON: JSON.stringify(process.env.IS_ELECTRON || false),
        BUILD_NAME_EXT: JSON.stringify(process.env.BUILD_NAME_EXT || null),
        COMMIT_HASH: JSON.stringify(commitHash),
        BRANCH_NAME: JSON.stringify(branchName),
        APP_VERSION: JSON.stringify(getVersion()),
        BUILD_TIME: JSON.stringify(Date.now()),
        USE_RESOURCE_CACHE: JSON.stringify(process.env.USE_RESOURCE_CACHE || false),
        USE_GENERIC_ANNOTATION: JSON.stringify(process.env.USE_GENERIC_ANNOTATION || false),
        UI_VERSION: JSON.stringify(process.env.UI_VERSION || require('./package.json').version),
        FLUENTFFMPEG_COV: JSON.stringify(false),
        //
        // Build flags
        //
        FLAG_ENABLE_FRAGMENT_ENCODING: JSON.stringify(process.env.FLAG_ENABLE_FRAGMENT_ENCODING || false),
        //
        // Features
        //
        MIGRATION_PREVIOUS_URL: JSON.stringify(process.env.MIGRATION_PREVIOUS_URL || null),
        MIGRATION_PREVIOUS_INFO_URL: JSON.stringify(process.env.MIGRATION_PREVIOUS_INFO_URL || null),
        USE_ACL: JSON.stringify(process.env.USE_ACL || true),
        USE_FILES: JSON.stringify(process.env.USE_FILES || true),
        USE_TAGS: JSON.stringify(process.env.USE_TAGS || true),
        USE_METADATA: JSON.stringify(process.env.USE_TAGS || true),
        USE_CUSTOM_MEDIA_STORE: JSON.stringify(process.env.USE_CUSTOM_MEDIA_STORE || false),
        UI_COLOR_HASH_SHADE: JSON.stringify(process.env.UI_COLOR_HASH_SHADE || '100'),
        UI_HIDE_MOSYS: JSON.stringify(process.env.UI_HIDE_MOSYS || false),
        UI_HIDE_DOCUMENTS: JSON.stringify(process.env.UI_HIDE_DOCUMENTS || false),
        UI_HIDE_GROUPS: JSON.stringify(process.env.UI_HIDE_GROUPS || false),
        UI_SHOW_ASSETS: JSON.stringify(process.env.UI_SHOW_ASSETS || false),
        MODULE_PROVIDER: JSON.stringify(process.env.MODULE_PROVIDER || null)
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
        'QBtnGroup',
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
        'QStepper',
        'QStep',
        'QStepperNavigation',
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
        'QProgress',
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
        'QEditor',
        'QCarousel',
        'QCarouselSlide',
        'QCarouselControl',
        'QAlert'
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
        'Screen',
        'AppFullscreen'
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
          keytar: 'commonjs keytar',
          'mbjs-auth-service': 'commonjs mbjs-auth-service'
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
