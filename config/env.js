// Levanta las variables de entorno del archivo .env
require('dotenv').config({ path: require('path').join(__dirname, '.env') })

//------------------------------- Variables de Entorno ----------------------------------
let vars = {

  app: {
    env: process.env.APP_NODE_ENV || 'development',
    pwd: process.env.APP_PWD || "",
    ssl_port: process.env.APP_SSL_PORT || 443,
    port: process.env.APP_PORT || 80,
    logLevel: process.env.LOG_LEVEL || 0,
    key: process.env.SSL_KEY || "/etc/letsencrypt/live/ingesursi.com.ar/privkey.pem",
    cert: process.env.SSL_KEY || "/etc/letsencrypt/live/ingesursi.com.ar/cert.pem",
    ca: process.env.SSL_KEY || "/etc/letsencrypt/live/ingesursi.com.ar/chain.pem",
  },

  users: {
    db: process.env.USERS_DB || "sqlite",
    rootMail: process.env.USERS_ROOT_EMAIL || "jbnogal@ventum-software.com",
    rootName: process.env.USERS_ROOT_NAME || "Juan Bautista",
    rootName: process.env.USERS_ROOT_LAST_NAME || "Nogal",
    rootPass: process.env.USERS_ROOT_PASS || "behops",
    rols: process.env.USERS_ROLS || "./db/users.db",
    permissions: process.env.USERS_PERMISSIONS || "./db/users.db",
  },

  dbs: {
    path: process.env.DBS_CONFIG || "/dbs/config.json",
  },

  middleware: {
    db: process.env.LOG_DB || "nebd",
    log: {
      req: {
        req: process.env.MIDDLEWARE_LOG_REQ_REQ || true,
        ip: process.env.MIDDLEWARE_LOG_REQ_IP || true,
        url: process.env.MIDDLEWARE_LOG_REQ_URL || true,
        method: process.env.MIDDLEWARE_LOG_REQ_METHOD || true,
        query: process.env.MIDDLEWARE_LOG_REQ_QUERY || true,
        headers: process.env.MIDDLEWARE_LOG_REQ_HEADERS || true, //false
        body: process.env.MIDDLEWARE_LOG_REQ_BODY || true,
        auth: process.env.MIDDLEWARE_LOG_REQ_AUTH || true,
      },
      res: {
        res: process.env.MIDDLEWARE_LOG_RES_RES || true,
        headers: process.env.MIDDLEWARE_LOG_RES_HEADERS || true,//false
        body: process.env.MIDDLEWARE_LOG_RES_BODY || true,
        auth: process.env.MIDDLEWARE_LOG_RES_AUTH || true,
      }
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET || "YOUR_secret_key", // key privada que uso para hashear passwords
    dfltExpiration: process.env.JWT_DURATION || 30 * 60 * 1000, // Cuanto duran los tokens por dflt en milisegundos
    saltWorkFactor: process.env.SALT_WORK_FACTOR || 10, //A: las vueltas que usa bcrypt para encriptar las password
  },

  mongo: {
    URI: process.env.MONGODB_URI || "mongodb://localhost:27017",
    adminName: process.env.ADMIN_NAME || "admin",
    adminPass: process.env.ADMIN_PASS || "admin",
    log: {
      insert: {
        req: {
          req: process.env.LOG_MONGO_INSERT_REQ_REQ || false,
          docs: process.env.LOG_MONGO_INSERT_REQ_DOCS || false,
        },
        res: {
          res: process.env.LOG_MONGO_INSERT_RES_RES || false,
          details: process.env.LOG_MONGO_INSERT_RES_DETAILS || false,
        }
      },
      delete: {
        req: {
          req: process.env.LOG_MONGO_DELETE_REQ_REQ || false,
          query: process.env.LOG_MONGO_DELETE_REQ_QUERY || false,
          options: process.env.LOG_MONGO_DELETE_REQ_OPT || false,
        },
        res: {
          res: process.env.LOG_MONGO_DELETE_RES_RES || false,
          details: process.env.LOG_MONGO_DELETE_RES_DETAILS || false,
        }
      },
      find: {
        req: {
          req: process.env.LOG_MONGO_FIND_REQ_REQ || false,
          query: process.env.LOG_MONGO_FIND_REQ_QUERY || false,
          projection: process.env.LOG_MONGO_FIND_REQ_PROJ || false,
          options: process.env.LOG_MONGO_FIND_REQ_OPT || false,
        },
        res: {
          res: process.env.LOG_MONGO_FIND_RES_RES || true,
          details: process.env.LOG_MONGO_FIND_RES_DETAILS || true,//false
        }
      },
      update: {
        req: {
          req: process.env.LOG_MONGO_UPDATE_REQ_REQ || false,
          query: process.env.LOG_MONGO_UPDATE_REQ_QUERY || false,
          update: process.env.LOG_MONGO_UPDATE_REQ_UPDATE || false,
          options: process.env.LOG_MONGO_UPDATE_REQ_OPT || false,
        },
        res: {
          res: process.env.LOG_MONGO_UPDATE_RES_RES || false,
          details: process.env.LOG_MONGO_UPDATE_RES_DETAILS || false,
        }
      },
      aggregate: {
        req: {
          req: process.env.LOG_MONGO_AGGREGATE_REQ_REQ || false,
          pipeline: process.env.LOG_MONGO_AGGREGATE_REQ_PIPELINE || false,
          options: process.env.LOG_MONGO_AGGREGATE_REQ_OPT || false,
        },
        res: {
          res: process.env.LOG_MONGO_AGGREGATE_RES_RES || false,
          details: process.env.LOG_MONGO_AGGREGATE_RES_DETAILS || false,
        }
      },
      count: {
        req: {
          req: process.env.LOG_MONGO_COUNT_REQ_REQ || false,
          query: process.env.LOG_MONGO_COUNT_REQ_QUERY || false,
          options: process.env.LOG_MONGO_COUNT_REQ_OPT || false,
        },
        res: {
          res: process.env.LOG_MONGO_COUNT_RES_RES || false,
          details: process.env.LOG_MONGO_COUNT_RES_DETAILS || false,
        }
      },

    }
  },

  aws: {
    s3:{
      region: process.env.AWS_S3_REGION || 'us-east-2',
      name: process.env.AWS_S3_NAME|| 'ingesur-aws-bucket',
      accessId: process.env.AWS_ACCESS_KEY_ID || 'AKIAYFFGK2MZFYT2PT4V',
      accessSecret: process.env.AWS_SECRET_ACCESS_KEY || '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',
    }
  }
}

module.exports = vars;