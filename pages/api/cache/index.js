import { cacheRead } from '@/lib/redis';

export default async function handler(req, res) {
    
    try {
        const obj = await cacheRead(req.query.key)             
      // console.log('API:Cache: ', req.query.key, ' : ', obj );
      res.status(200).json({ content: obj })
    } catch (error) {
      // console.log(error)
      res.status(500).json({error: 'error fetching from cache: ' + error})
    }
  }