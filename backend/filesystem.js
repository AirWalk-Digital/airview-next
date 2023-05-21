import fs from 'fs';
import path from 'path';
import glob from 'glob';
// const glob = require('glob')

export async function getAllFiles(filePath) {
    const contentDir = 'content'
    const targetDir = filePath ? path.join(process.cwd(), contentDir, filePath) : path.join(process.cwd(), 'content')
  
    return new Promise((resolve, reject) => {
      glob(targetDir + '/**/*.md*', (err, files) => {
        if (err) {
          reject(err)
        } else {
          const relativeFiles = files.map((file) => {
            const relativePath = path.relative(process.cwd(), file)
            return relativePath.replace(contentDir , "")
        
          })
          resolve(relativeFiles.filter(Boolean))
        }
      })
    })
  }
  
  


export async function getFileContent(filePath) {
  try {
    const absolutePath = path.join(process.cwd(), 'content', filePath)
    const fileContent = fs.readFileSync(absolutePath, 'utf-8')
    return fileContent
  } catch (error) {
    throw new Error('Failed to read the file: ' + error)
  }
}
