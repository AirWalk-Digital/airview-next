import { cacheWrite, cacheRead, cacheDelete } from '@/lib/redis';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Extract data from the request body
            const data = req.body;
            const cacheKey = 'geco-placeholder-' + req.body.code

            try {
                await cacheWrite(cacheKey, JSON.stringify(data)); // attempt to cache data
            } catch (cacheError) {
                // If cacheWrite fails, log the error and send a 500 response
                res.status(500).json({ error: 'Failed to write to cache.' });
                console.error('[API/resourcing/placeholder/POST][Cache Write Error]:', cacheError);
            }
            // Here you would process your data as needed
            // console.log(data);

            // Send a response to indicate success
            res.status(200).json({ status: 'Success', message: 'Data processed' });
        } catch (error) {
            // Handle any errors
            res.status(500).json({ status: 'Error', message: error.message });
        }
    } else if (req.method === 'GET') {

        if (req.query.code) {
            try {
                const cacheKey = 'geco-placeholder-' + req.query.code
                const obj = await cacheRead(cacheKey)
                // console.log('API:Cache: ', req.query.key, ' : ', obj );
                res.status(200).json({ content: obj })
            } catch (error) {
                // console.log(error)
                res.status(500).json({ error: 'error fetching from cache: ' + error })
            }
        } else {
            res.status(500).json({ error: 'error fetching from cache: no code passed' })

        }
    } else if (req.method === 'DELETE') {
        try {
            const cacheKey = 'geco-placeholder-' + req.query.code
            await cacheDelete(cacheKey); // assuming cacheDelete is a function you have for deleting cache
            res.status(200).json({ status: 'Success', message: 'Data deleted from cache' });
        } catch (error) {
            console.error('[API/resourcing/placeholder/DELETE][Cache Delete Error]:', error);
            res.status(500).json({ status: 'Error', message: 'Failed to delete from cache.' });
        }
    } else {
        // If the request is not POST, GET, or DELETE, return a 405 Method Not Allowed error
        res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

