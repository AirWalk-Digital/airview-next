
export default async function handler(req, res) {
  const axios = require('axios');
  const client = axios.create({
    baseURL: process.env.ETHERPAD_BASE_URL,
    timeout: 1000,
    params: { apikey: process.env.ETHERPAD_API_KEY },
  });
  let pad = null;
  try {
    let params = { padID: req.query.pad };

    if(req.query.rev) {
        params.rev = req.query.rev;
    }
    
    let resp = await client.get('getText', { params });
    pad = resp.data.data?.text
    console.log(pad);
    res.status(200).json({ content: pad })
  } catch (error) {
    console.log(error)
    res.status(500).json({error: 'error fetching pad: ' + error})
  }
}