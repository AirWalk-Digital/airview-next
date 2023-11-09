// pages/resources/resources.js

import formidable from 'formidable-serverless';
import { promises as fs } from 'fs';
import { parseExcelXml, expandResourceData, calculateDemand, timesheetPortalHolidays, combineResourcesWithHolidays } from '@/lib/loaders'; // Adjust the path as necessary
import { cacheWrite, cacheRead } from '@/lib/redis';

import users from './users.json';


export const config = {
    api: {
        bodyParser: false,
    },
};




export default async function handler(req, res) {
    const cacheKey = 'geco-all-resources'
    if (req.method === 'POST') {
        // Parse the multipart form data
        const data = await new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm();
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve(files);
            });
        });

        try {
            // Access the uploaded file
            const file = data.file instanceof Array ? data.file[0] : data.file;
            if (!file) {
                throw new Error('No file uploaded.');
            }

            // Read the file from the uploaded path
            const content = await fs.readFile(file.path, 'utf-8');

            // Process the file content through parseExcelXml
            try {
                const jsonData = await parseExcelXml(content);
                // console.debug('/api/upload: ', jsonData);

                const resourceData = expandResourceData(jsonData, users)

                const holidays = await timesheetPortalHolidays(process.env.TSP_CLIENT_ID, process.env.TSP_CLIENT_SECRET)
                // const groupedHolidays = groupLeaveData()
                const resourceDataWithHolidays = combineResourcesWithHolidays(resourceData, holidays)
                // res.status(200).json({'resource': resourceData, 'holidays': holidays}); // Respond with JSON data                

                const demandData = calculateDemand(resourceData)

                try {
                    await cacheWrite('geco-excel-conversion', JSON.stringify(jsonData)); // attempt to cache data
                } catch (cacheError) {
                    // If cacheWrite fails, log the error but dont send a 500 response
                    console.error('[API/resourcing/resources/POST][Cache Write Error (geco-excel-conversion)]:', cacheError);
                }
                try {
                    await cacheWrite('geco-demand', JSON.stringify(demandData)); // attempt to cache data
                } catch (cacheError) {
                    // If cacheWrite fails, log the error and send a 500 response
                    res.status(500).json({ error: 'Failed to write to cache.' });
                    console.error('[API/resourcing/resources/POST][Cache Write Error (geco-demand)]:', cacheError);
                }

                try {
                    await cacheWrite(cacheKey, JSON.stringify(resourceDataWithHolidays)); // attempt to cache data
                    res.status(200).json(resourceDataWithHolidays); // Respond with JSON data
                } catch (cacheError) {
                    // If cacheWrite fails, log the error and send a 500 response
                    console.error('[API/resourcing/resources/POST][Cache Write Error (', cacheKey, ')]:', cacheError);
                    res.status(500).json({ error: 'Failed to write to cache.' });
                    return; // Stop further execution
                }


            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'GET') {

        if (req.query.demand === 'true') {
            try {
                const obj = await cacheRead('geco-demand')
                // console.log('API:Cache: ', req.query.key, ' : ', obj );
                res.status(200).json({ content: obj })
            } catch (error) {
                // console.log(error)
                res.status(500).json({ error: 'error fetching from cache: ' + error })
            }
        } else {

            try {
                const obj = await cacheRead(cacheKey)
                // console.log('API:Cache: ', req.query.key, ' : ', obj );
                res.status(200).json({ content: obj })
            } catch (error) {
                // console.log(error)
                res.status(500).json({ error: 'error fetching from cache: ' + error })
            }
        }


    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST, GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
