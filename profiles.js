const axios = require('axios')
const { ethers } = require('ethers')
const fs = require('fs')

const PROFILE = `
  query Profile($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      handle
    }
  }
`

const end = 50000

async function fetchUsers(startId) {
  for (i = startId; i < end; i++) {
    const { data } = await axios({
      url: 'https://api.lens.dev',
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        operationName: 'Profile',
        query: PROFILE,
        variables: { request: { profileId: `${ethers.utils.hexlify(i)}` } }
      }
    })

    const handle = data?.data?.profile?.handle
    fs.writeFileSync('lastid.txt', `${i}`)

    if (!handle) {
      console.log(`Next ID starts from: ${i}`)
      return
    }

    console.log(
      `${i} (${ethers.utils.hexlify(i)}) => https://lenster.xyz/u/${handle}`
    )
    fs.appendFileSync(
      'sitemaps/profiles/50000.txt',
      `https://lenster.xyz/u/${handle}\n`
    )
  }
}

fetchUsers(parseInt(fs.readFileSync('lastid.txt', 'utf8')))
