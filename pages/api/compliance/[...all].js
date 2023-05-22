import { createProxyMiddleware } from "http-proxy-middleware"; // @2.0.6

export const config = {
  api: {
    externalResolver: true,
  }
}

const proxy = createProxyMiddleware({
  target: 'http://localhost:5000',
  secure: false,
  pathRewrite: { "^/api/compliance/": "" }, // remove `/api/proxy` prefix
});

function addTrailingSlash(url) {
  // Use regex to check if a trailing slash exists only in the pathname
  var regex = /(\/)(?![?/])$/;
  
  if (regex.test(url)) {
    return url; // URL already has a trailing slash in the pathname
  } else {
    return url.replace(/(\/)?(\?|$)/, '/$2'); // Append a trailing slash to the URL
  }
}


export default function handler(req, res) {
  req.url = addTrailingSlash(req.url);
  proxy(req, res, (err) => {
    if (err) {
      throw err;
    }

    throw new Error(
      `Request '${req.url}' is not proxied! We should never reach here!`
    );
  });
}
