import next from 'next';
import express from 'express';
import expressSession from 'express-session';
import passport from 'passport'
import * as dotenv from 'dotenv'
import ApiRouter from './api/router'
import AuthRouter from './auth/router'
import AuthStrategy from './auth/authStrategy';
import prisma from './db/db';
import { checkAdmin, checkAuthClient, checkAuthRedirect } from './auth/checkAuth';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../.env')
})
passport.use(AuthStrategy)

const isDev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev: isDev, hostname: "localhost", port: parseInt(process.env.WEB_PORT) })
const nextAppHandle = nextApp.getRequestHandler()

const app = express()

const init = async () => {
  await nextApp.prepare()
  await prisma.$connect()

  app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      // sameSite: "strict"
    },
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
        logger: console
      }
    )
  }))
  app.use(express.json())
  app.use(passport.authenticate('session'))
  app.use('/auth', AuthRouter)
  app.use('/api', ApiRouter)

  app.get('/login', checkAuthRedirect)
  
  app.get('/dash', (req, res) => res.redirect('/dash/me'))
  app.get('/dash/*', checkAuthClient)
  app.get('/dash/admin', checkAdmin)

  app.get('*', (req, res) => {
    return nextAppHandle(req, res)
  })

  app.listen(process.env.WEB_PORT, () => {
    console.log("server iz up")
  })
}
init()