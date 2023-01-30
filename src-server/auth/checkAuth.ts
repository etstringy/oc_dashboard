import {
  Request,
  Response,
  NextFunction
} from 'express';
import prisma from '../db/db';

export function checkAuthApi(req: Request, res: Response, next: NextFunction) {
  if(req.user) {
    next()
  } else {
    return res.status(401).send()
  }
}

export function checkAuthClient(req: Request, res: Response, next: NextFunction) {
  if(req.user) {
    next()
  } else {
    return res.redirect('/login')
  }
}

export function checkAuthRedirect(req: Request, res: Response, next: NextFunction) {
  if(req.user) {
    return res.redirect('/dash/me')
  } else {
    next()
  }
}

export function checkAdmin(req: Request, res: Response, next: NextFunction) {
  prisma.user.findFirst({ where: {
    id: (req.user as any).userId
  }})
  .then(user => {
    if(user.admin) {
      next()
    } else {
      return res.status(403).send("naur...")
    }
  })
}