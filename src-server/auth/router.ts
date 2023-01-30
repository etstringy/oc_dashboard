import { Router } from 'express';
import passport from 'passport';
import { checkAuthClient } from '../auth/checkAuth'

const router = Router()

router.get('/', passport.authenticate('discord'))
router.get('/logout', checkAuthClient, (req, res) => {
  req.logout(() => {
    res.redirect('/login')
  })
})
router.get('/wouldyoucallback', passport.authenticate('discord', {
  failureRedirect: '/login?youfuckedup=lol',
  successRedirect: '/dash/me'
})
)

export default router