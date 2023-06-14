import fs from 'fs';
import path from 'path';
import glob from 'glob';
// const glob = require('glob')

export async function getAllFiles(filePath, globmatcher = '/**/*.md*') {
    const contentDir = 'content'
    const targetDir = filePath ? path.join(process.cwd(), contentDir, filePath) : path.join(process.cwd(), 'content')
  
    return new Promise((resolve, reject) => {
      glob(targetDir + globmatcher, (err, files) => {
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
  
  export async function getAllDirectories(filePath) {
    const contentDir = 'content';
    const targetDir = filePath ? path.join(process.cwd(), contentDir, filePath) : path.join(process.cwd(), 'content');
  
    return new Promise((resolve, reject) => {
      glob(targetDir + '/**/*.md*', { nodir: true }, (err, files) => {
        if (err) {
          reject(err);
        } else {
          const relativeDirectories = new Set();
  
          files.forEach((file) => {
            const relativePath = path.relative(targetDir, file);
            const directory = path.dirname(relativePath);
            relativeDirectories.add(directory);
          });
  
          const relativeDirectoriesArray = [...relativeDirectories];
  
          resolve(relativeDirectoriesArray);
        }
      });
    });
  }
  

export async function getFileContent(filePath) {
  try {
    const absolutePath = path.join(process.cwd(), 'content', filePath)
    // // console.log('getFileContent:absolutePath: ', absolutePath)
    const fileContent = fs.readFileSync(absolutePath, 'utf-8')
    return fileContent
  } catch (error) {
    throw new Error('Failed to read the file: ' + error)
  }
}
