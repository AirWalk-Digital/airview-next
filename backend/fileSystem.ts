import fs from 'fs';
import glob from 'glob';
import path from 'path';

export async function getAllFiles(filePath: string, globmatcher = '/**/*.md*') {
    const contentDir = 'content'
    const targetDir = filePath ? path.join(process.cwd(), contentDir, filePath) : path.join(process.cwd(), 'content')
  
    return new Promise((resolve, reject) => {
      glob(targetDir + globmatcher, (err: any, files: any[]) => {
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
  
  
  export async function getAllDirectories(filePath: string) {
    const contentDir = 'content';
    const targetDir = filePath ? path.join(process.cwd(), contentDir, filePath) : path.join(process.cwd(), 'content');
  
    return new Promise((resolve, reject) => {
      glob(targetDir + '/**/*.md*', (err: any, files: any[]) => {
        if (err) {
          reject(err);
        } else {
          const relativeDirectories = new Set<string>();
  
          files.forEach((file) => {
            const relativePath = path.relative(targetDir, file);
            const directory = path.dirname(relativePath);
            relativeDirectories.add(directory);
          });
  
          const relativeDirectoriesArray = Array.from(relativeDirectories);
  
          resolve(relativeDirectoriesArray);
        }
      });
    });
  }
  

export async function getFileContent(filePath: string) {
  try {
    const absolutePath = path.join(process.cwd(), 'content', filePath)
    // // // console.log('getFileContent:absolutePath: ', absolutePath)
    const fileContent = fs.readFileSync(absolutePath, 'utf-8')
    return fileContent
  } catch (error) {
    throw new Error('Failed to read the file: ' + error)
  }
}
