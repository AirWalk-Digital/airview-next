import { cacheWrite, cacheRead, cacheDelete, cacheSearch } from '@/lib/redis';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Extract data from the request body
            const data = req.body;
            const cacheKeyJob = 'geco-placeholder-' + req.body.code + '-' + req.body.role_id
            const cacheKeyResource = 'geco-placeholder-' + req.body.resource

            try { // write the placeholder data per job
                await cacheWrite(cacheKeyJob, JSON.stringify(data)); // attempt to cache data
            } catch (cacheError) {
                // If cacheWrite fails, log the error and send a 500 response
                res.status(500).json({ error: 'Failed to write to cache.' });
                console.error('[API/resourcing/placeholder/POST][Cache Write Error (Job)]:', cacheError);
            }
            // try { // write placeholder data per resource
            //     await cacheWrite(cacheKeyResource, JSON.stringify(data)); // attempt to cache data
            // } catch (cacheError) {
            //     // If cacheWrite fails, log the error and send a 500 response
            //     res.status(500).json({ error: 'Failed to write to cache.' });
            //     console.error('[API/resourcing/placeholder/POST][Cache Write Error (Resource)]:', cacheError);
            // }

            res.status(200).json({ status: 'Success', message: 'Data processed' });
        } catch (error) {
            // Handle any errors
            res.status(500).json({ status: 'Error', message: error.message });
        }
    } else if (req.method === 'GET') {

        if (req.query.code) {
            try {
                const cacheKey = 'geco-placeholder-' + req.query.code + '-' + req.query.role_id
                const obj = await cacheRead(cacheKey)
                // console.log('API:Cache: ', req.query.key, ' : ', obj );
                res.status(200).json({ content: obj })
            } catch (error) {
                // console.log(error)
                res.status(500).json({ error: 'error fetching from cache: ' + error })
            }
        } else { // return all
            try {

                const cacheKey = 'geco-placeholder*'
                const keys = await cacheSearch(cacheKey);
                

                // If keys is null or undefined, handle the error or send an empty array response.
                if (!keys || keys.length === 0) {
                    res.status(200).json({ content: [] });
                    return;
                }

                let placeholderData = [];
                const cacheAll = await Promise.all(keys.map(item => cacheRead(item)));

                // console.log('API:/api/etherpad/imported: ', padMeta)
            
                cacheAll.forEach((item, index) => {
                  item = JSON.parse(item);
                  placeholderData.push(item);
                })
                console.log(placeholderData)
                res.status(200).json({ content: placeholderData });
            } catch (error) {
                // console.log(error)
                res.status(500).json({ error: 'error fetching from cache: ' + error })
            }
        }
    } else if (req.method === 'DELETE') {
        try {
            const cacheKey = 'geco-placeholder-' + req.query.code + '-' + req.query.role_id
            await cacheDelete(cacheKey); // assuming cacheDelete is a function you have for deleting cache
            res.status(200).json({ status: 'Success', message: `Data deleted from cache` });
        } catch (error) {
            console.error('[API/resourcing/placeholder/DELETE][Cache Delete Error]:', error);
            res.status(500).json({ status: 'Error', message: 'Failed to delete from cache : ' + error });
        }
    } else {
        // If the request is not POST, GET, or DELETE, return a 405 Method Not Allowed error
        res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

