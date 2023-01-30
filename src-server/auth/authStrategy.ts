import { Strategy } from 'passport-discord';
import randomstring from 'randomstring';
import prisma from '../db/db';
import passport from 'passport';

passport.serializeUser(function(user: any, cb) {
  process.nextTick(function() {
    cb(null, { userId: user.id });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

const strat = new Strategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: ['identify']
},
async (accessToken, refreshToken, profile, cb) => {
  const allowlisted = await prisma.whitelistedUser.findFirst({
    where: {
      discordId: profile.id
    }
  })

  if(!allowlisted) {
    return cb(null, false)
  }

  const exists = await prisma.user.findFirst({
    where: {
      discordId: profile.id
    }
  })

  const pfp = (profile.avatar) ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.jpg` : `https://cdn.discordapp.com/embed/avatars/0.png`

  if(exists){
    const user = await prisma.user.update({
      where: {
        id: exists.id,
      },
      data: {
        username: profile.username,
        tag: profile.discriminator,
        pfp: pfp
      }
    })

    return cb(null, user);
  } else {
    const user = await prisma.user.create({
      data: {
        discordId: profile.id,
        username: profile.username,
        tag: profile.discriminator,
        pfp: pfp
      }
    })
    
    return cb(null, user);
  }

})

export default strat;