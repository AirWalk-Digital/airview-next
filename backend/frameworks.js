// utils/frameworks.js

import fs from 'fs';
import path from 'path';
import glob from 'glob';

import { buffer } from 'sharp/lib/is';

export function getBaseFramework() {
  const filePath = path.join(process.cwd(), 'content/frameworks/primary-dataset.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);

  return data; // Assuming the "business-units" key holds the array of business-units
}

export function getFrameworkMappingByName(id) {
  const filePath = path.join(process.cwd(), 'content/frameworks/secondary/' + id + '/mapping.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  return data; // Assuming the "business-units" key holds the array of business-units
}

export function getFrameworkByName(id) {
  const filePath = path.join(process.cwd(), 'content/frameworks/secondary/' + id + '/framework.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  return data; // Assuming the "business-units" key holds the array of business-units
}

export async function getFrameworks() {
  const contentDir = 'content/frameworks/secondary'
  const globmatcher = '/**/framework.json'
  const targetDir = path.join(process.cwd(), contentDir)

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
