
import { SPDefault } from "@pnp/nodejs";
import { spfi } from "@pnp/sp";
import path from 'path';
import "@pnp/sp/webs/index.js";
import { readFileSync } from 'fs';
// import { Configuration } from "@azure/msal-node";
import mime from 'mime-types';


    // configure your node options (only once in your application)
    let buffer = process.env.SHAREPOINT_PRIVATE_KEY;
    if (!buffer) {
        const privateKeyPath = process.env.SHAREPOINT_PRIVATE_KEY_FILE;
        buffer = readFileSync(privateKeyPath);
    }

    const config = {
        auth: {
            authority: `https://login.microsoftonline.com/${process.env.SHAREPOINT_TENANT}/`,
            clientId: process.env.SHAREPOINT_CLIENT_ID,
            clientCertificate: {
                thumbprint: process.env.SHAREPOINT_PRIVATE_KEY_THUMBPRINT,
                privateKey: buffer.toString(),
            },
        },
    };


export default async function handler(req, res) {
  try {
    // console.log('SharePoint:File: ', req.query.url)
    const site = extractSiteFromUrl(req.query.url);
    // console.log(site); 
    const sp = spfi().using(SPDefault({
        baseUrl: `https://${process.env.SHAREPOINT_BASE}.sharepoint.com/sites/${site}/`,
        msal: {
            config: config,
            scopes: [`https://${process.env.SHAREPOINT_BASE}.sharepoint.com/.default`]
            // scopes: ["https://graph.microsoft.com/.default"]
    
        }
    }));
    
    // Use SharePoint API methods
    
    // get the file name
    const item = await sp.web.getFileByUrl(req.query.url).getItem('FileLeafRef');

    // get the file
    const file = await sp.web.getFileByUrl(req.query.url);
    
    const fileContents = await file.getBuffer();
     // Convert the ArrayBuffer to a Buffer
    const buffer = Buffer.from(fileContents);

    const extension = path.extname(item.FileLeafRef);
    const contentType = mime.lookup(extension) || 'application/octet-stream';
    // res.setHeader("Content-Disposition", `attachment; filename=${item.FileLeafRef}`); // use this if you want to return an attachment
    res.setHeader("Content-Type", contentType);
    res.send(buffer);

    // console.log('SharePoint:RawFile: ', fileContents)
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Error fetching file");
  }
}

function extractSiteFromUrl(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/');
    return parts[3];
  }

