import { Router } from 'express';
import passport from 'passport';
import prisma from '../db/db';
import { z } from 'zod';
import { checkAuthApi as authenticate, checkAdmin } from '../auth/checkAuth';
import cloudflare from '../external/cloudflare';
import { truncate } from 'fs/promises';

const router = Router()

router.get('/', (req, res) => {
  res.send("meow")
})

router.get('/frontpage', async (req,res) => {
  const data = await prisma.user.findMany({
    select: {
      frontpageDomainId: true,
      frontpageName: true,
      frontpageColor: true
    },
    where: {
      AND: [
        {
          frontpageDomainId: {
            not: undefined
          }
        },
        {
          frontpageDomainId: {
            not: ''
          }
        }
      ]
    }
  })

  const final = await Promise.all(data.map(async (e) => {
    const known = await prisma.subdomain.findFirst({
      where: {
        id: e.frontpageDomainId
      }
    })

    if(!known) return undefined

    return {
      name: e.frontpageName,
      color: e.frontpageColor,
      domain: known.name + "." + known.domain
    }
  }))
  res.send(final)
})

router.get('/@me', authenticate, (req, res) => {
  const userId = (req.user as any).userId
  prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      admin: true,
      username: true,
      tag: true,
      id: true,
      discordId: true,
      pfp: true,
    }
  })
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    console.log(err)
    res.status(500).send("yo sorry guys i fucked up")
  })
})

router.get('/@me/domains', authenticate, (req, res) => {
  const userId = (req.user as any).userId
  prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      domains: {
        select: {
          id: true,
          name: true,
          domain: true
        }
      }
    }
  })
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    console.log(err)
    res.status(500).send("yo sorry guys i fucked up")
  })
})

router.get('/@me/frontpage', authenticate, (req, res) => {
  const userId = (req.user as any).userId
  prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      frontpageDomainId: true,
      frontpageName: true,
      frontpageColor: true
    }
  })
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    console.log(err)
    res.status(500).send("yo sorry guys i fucked up")
  })
})

router.patch('/@me/frontpage', authenticate, async (req, res) => {
  const color_regex = /(?:[0-9a-fA-F]{3}){1,2}$/g
  const schema = z.object({
    domainId: z.string().max(63),
    text: z.string().max(20),
    color: z.string().regex(color_regex)
  })

  try {
    schema.parse(req.body)
  } catch(e) {
    return res.status(400).json(e);
  }

  if(req.body.domainId == "hide") {
    req.body.domainId = undefined
  } else {
    const domainExists = await prisma.subdomain.findFirst({
      where: {
        id: req.body.domainId
      }
    })
  
    if(!domainExists) return res.status(400).send("invalid domain id")
  }

  const userId = (req.user as any).userId
  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      frontpageDomainId: req.body.domainId,
      frontpageName: req.body.text,
      frontpageColor: req.body.color
    }
  })
  .then(user => {
    res.status(200).send()
  })
  .catch(err => {
    console.log(err)
    res.status(500).send("yo sorry guys i fucked up")
  })
})


router.get(`/domain/:domainid/dns`, authenticate, async (req, res) => {
  const subdomain = await prisma.subdomain.findFirst({
    where: {
      id: req.params.domainid
    },
    include: {
      ownedBy: true
    }
  })

  if(!subdomain) return res.status(404).send("subdomain not found")

  if(subdomain.ownedBy.find((user: any) => user.id === (req.user as any).userId)) {
    cloudflare.dnsRecords.browse(subdomain.cfZoneId)
      .then((zones: any) => {
        res.json(zones.result.filter((r: any) => r.name.endsWith(subdomain.name+"."+subdomain.domain)))
      })
  } else {
    res.status(403).send("you don't have permission to manage this domain")
  }
})

router.put(`/domain/:domainid/dns`, authenticate, async (req, res) => {
  const subdomain = await prisma.subdomain.findFirst({
    where: {
      id: req.params.domainid
    },
    include: {
      ownedBy: true
    }
  })
  if(!subdomain) return res.status(404).send("subdomain not found")

  if(subdomain.ownedBy.find((user: any) => user.id === (req.user as any).userId)) {

    const schema = z.object({
      type: z.enum(["A", "CNAME", "MX", "TXT"]),
      name: z.string().max(63),
      content: z.string().max(63)
    })
  
    try {
      schema.parse(req.body)
    } catch(e) {
      return res.status(400).json(e);
    }

    if(req.body.name != subdomain.name+"."+subdomain.domain && !req.body.name.endsWith("."+subdomain.name+"."+subdomain.domain)) {
      return res.status(400).send("name must be a subdomain of the domain")
    }

    cloudflare.dnsRecords.add(subdomain.cfZoneId, {
        type: req.body.type,
        name: req.body.name,
        content: req.body.content,
        ttl: 1,
        proxied: false
    })
    .then((zones: any) => {
      res.status(200).send()
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send("something went wrong")
    })
  } else {
    res.status(403).send("you don't have permission to manage this domain")
  }
})

router.delete(`/domain/:domainid/dns`, authenticate, async (req, res) => {
  const schema = z.object({
    id: z.string().max(63),
  })

  try {
    schema.parse(req.body)
  } catch(e) {
    return res.status(400).json(e);
  }

  const subdomain = await prisma.subdomain.findFirst({
    where: {
      id: req.params.domainid
    },
    include: {
      ownedBy: true
    }
  })
  if(!subdomain) return res.status(404).send("subdomain not found")

  if(subdomain.ownedBy.find((user: any) => user.id === (req.user as any).userId)) {
    cloudflare.dnsRecords.del(subdomain.cfZoneId, req.body.id)
    .then((zones: any) => {
      res.status(200).send()
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send("something went wrong")
    })
  } else {
    res.status(403).send("you don't have permission to manage this domain")
  }
})

router.post('/admin/users/search', checkAdmin, async (req, res) => {
  const schema = z.object({
    query: z.string().max(63),
  })

  try {
    schema.parse(req.body)
  } catch(e) {
    return res.status(400).json(e);
  }

  const exists = await prisma.user.findMany({
    where: {
      username: {
        contains: req.body.query
      }
    },
    select: {
      username: true,
      pfp: true,
      id: true,
      tag: true
    }
  })

  res.status(200).send(exists)
})

router.get('/admin/cfzones', checkAdmin, (req,res) => {
  cloudflare.zones.browse()
    .then((zones: any) => {
      res.json(zones.result.map(({id, name}: any) => {
        return {id, name}
      }))
    })
})

router.get('/admin/subdomain/list', checkAdmin, async (req, res) => {
  const exists = await prisma.subdomain.findMany({
    include: {
      ownedBy: true
    }
  })
  res.status(200).json(exists)
})

router.put('/admin/subdomain', checkAdmin, async (req, res) => {
  const schema = z.object({
    name: z.string().max(63),
    domain: z.string().max(127),
    cfZoneId: z.string().max(32)
  })

  try {
    schema.parse(req.body)
  } catch(e) {
    return res.status(400).json(e);
  }

  const exists = await prisma.subdomain.findFirst({
    where: {
      AND: [
        {
          name: req.body.name
        },
        {
          cfZoneId: req.body.cfZoneId
        }
      ]
    }
  })

  if(exists) return res.status(400).send("Subdomain already exists")

  await prisma.subdomain.create({
    data: {
      cfZoneId: req.body.cfZoneId,
      domain: req.body.domain,
      name: req.body.name
    }
  })

  res.status(200).send()
})

router.delete('/admin/subdomain/:id', checkAdmin, async (req, res) => {
  const schema = z.object({
    id: z.string()
  })

  try {
    schema.parse(req.params)
  } catch(e) {
    return res.status(400).json(e);
  }

  const exists = await prisma.subdomain.findFirst({
    where: {
      id: req.params.id
    }
  })

  if(!exists) return res.status(400).send("Subdomain does not exist")

  prisma.subdomain.delete({
    where: {
      id: exists.id
    }
  })
  .then(() => {
    res.status(200).send()
  })
  .catch(e => {
    console.log(e)
    res.status(500).send("yo sorry guys i fucked up")
  })
})

router.patch('/admin/subdomain/:id/assign', checkAdmin, async (req, res) => {
  const schema = z.object({
    userId: z.string()
  })

  try {
    schema.parse(req.body)
  } catch(e) {
    return res.status(400).json(e);
  }

  const exists = await prisma.subdomain.findFirst({
    where: {
      id: req.params.id
    },
    include: {
      ownedBy: true
    }
  })

  if(!exists) return res.status(400).send("Subdomain does not exist")
  if(exists.ownedBy.find((e) => e.id == req.body.userId)) return res.status(400).send("User is already assigned to this subdomain")

  prisma.subdomain.update({
    data: {
      ownedBy: {
        connect: {
          id: req.body.userId
        }
      }
    },
    where: {
      id: exists.id
    }
  })
  .then(() => {
    res.status(200).send()
  })
  .catch(e => {
    console.log(e)
    res.status(500).send("yo sorry guys i fucked up")
  })
})

router.patch('/admin/subdomain/:id/unassign', checkAdmin, async (req, res) => {
  const schema = z.object({
    userId: z.string()
  })

  try {
    schema.parse(req.body)
  } catch(e) {
    return res.status(400).json(e);
  }

  const exists = await prisma.subdomain.findFirst({
    where: {
      id: req.params.id
    },
    include: {
      ownedBy: true
    }
  })

  if(!exists) return res.status(400).send("Subdomain does not exist")
  if(!exists.ownedBy.find((e) => e.id == req.body.userId)) return res.status(400).send("User is already unassigned from this subdomain")

  prisma.subdomain.update({
    data: {
      ownedBy: {
        disconnect: {
          id: req.body.userId
        }
      }
    },
    where: {
      id: exists.id
    }
  })
  .then(() => {
    res.status(200).send()
  })
  .catch(e => {
    console.log(e)
    res.status(500).send("yo sorry guys i fucked up")
  })
})


router.get('/admin/allowlist/', checkAdmin, async (req, res) => {
  const exists = await prisma.whitelistedUser.findMany()
  const promises = exists.map(async (e) => {
    const known = await prisma.user.findFirst({
      where: {
        discordId: e.discordId
      }
    })

    return {
      ...e,
      known
    }
  })
  const final = await Promise.all(promises)
  res.status(200).json(final)
})

router.put('/admin/allowlist', checkAdmin, async (req, res) => {
  const schema = z.object({
    discordId: z.string()
  })

  try {
    schema.parse(req.body)
  } catch(e) {
    return res.status(400).json(e);
  }

  const exists = await prisma.whitelistedUser.findFirst({
    where: {
      discordId: req.body.discordId
    }
  })

  if(exists) return res.status(400).send("User is already allowlisted")

  await prisma.whitelistedUser.create({
    data: {
      discordId: req.body.discordId
    }
  })

  res.status(200).send()
})

router.delete('/admin/allowlist/', checkAdmin, async (req, res) => {
  const schema = z.object({
    id: z.string()
  })

  try {
    schema.parse(req.body)
  } catch(e) {
    return res.status(400).json(e);
  }

  const exists = await prisma.whitelistedUser.findFirst({
    where: {
      id: req.body.id,
    }
  })

  if(!exists) return res.status(400).send("User is not allowlisted")

  prisma.whitelistedUser.delete({
    where: {
      id: exists.id
    }
  })
  .then(() => {
    res.status(200).send()
  })
  .catch(e => {
    console.log(e)
    res.status(500).send("yo sorry guys i fucked up")
  })
})


export default router