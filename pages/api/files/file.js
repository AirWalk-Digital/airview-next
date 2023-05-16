
import fs from 'fs'
import path from 'path'
const glob = require("glob");

export default async function handler(req, res) {

  const { filePath } = req.query;
  
  try {
    // Resolve the absolute path of the file
    // const absolutePath = path.resolve(filePath);
    const absolutePath = path.join(process.cwd(), '/', req.query.filePath)
    // console.log('api:/files/file:absolutePath: ', absolutePath)
    // Read the file from the filesystem
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    // console.log('api:/files/file:fileContent: ', fileContent)

    // Return the file content as the response
    res.status(200).json({ content: fileContent });
  } catch (error) {
    console.log('api:file Error: ', error)

    // Return an error response if the file couldn't be read
    res.status(500).json({ error: 'Failed to read the file.' });
  }


  // try {
  //       const filePath = path.join(process.cwd(), '/', req.query.path)
  //       console.log('api:files/file: ', filePath)
  //       const fileData = fs.readFileSync(filePath, "utf8")
  //       return { fileData, error: false }
  //   } catch (error) {
  //       return { fileData: null, error: error }
  //   }
};

