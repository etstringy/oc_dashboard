import cloudflare from 'cloudflare';

const cf = new cloudflare({
  token: process.env.CLOUDFLARE_TOKEN
})

export default cf;