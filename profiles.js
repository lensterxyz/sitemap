const axios = require("axios");
const axiosRetry = require("axios-retry");
const { ethers } = require("ethers");
const fs = require("fs");

const PROFILE = `
  query Profile($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      handle
    }
  }
`;

const end = 150000;

axiosRetry(axios, {
  retries: 200,
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return 2000;
  },
  retryCondition: (error) => {
    return error;
  },
});

async function fetchUsers(startId) {
  for (i = startId; i < end; i++) {
    const { data } = await axios({
      url: "https://api.lens.dev",
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      data: {
        operationName: "Profile",
        query: PROFILE,
        variables: { request: { profileId: `${ethers.utils.hexlify(i)}` } },
      },
    });

    const handle = data?.data?.profile?.handle.replace(".lens", "");
    fs.writeFileSync("lastid.txt", `${i}`);

    if (!handle) {
      console.log(`Next ID starts from: ${i}`);
      return;
    }

    console.log(
      `${i} (${ethers.utils.hexlify(i)}) => https://lenster.xyz/u/${handle}`
    );
    fs.appendFileSync(
      "sitemaps/profiles/150000.txt",
      `https://lenster.xyz/u/${handle}\n`
    );
  }
}

fetchUsers(parseInt(fs.readFileSync("lastid.txt", "utf8")));
