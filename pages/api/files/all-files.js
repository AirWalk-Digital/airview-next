const glob = require('glob')

export default async function handler(req, res) {

  try {

    const targetDir = path.join(process.cwd(), 'markdown')

    glob(targetDir + '/**/*.md*', (err, files) => {
      if (err) {
        console.log('Error', err)
      } else {
        console.log(files)
        res.status(200).json({ files: files, })
      }
    })

  } catch (error) {
    console.log(error)
  }
};