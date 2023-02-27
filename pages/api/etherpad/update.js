export default function handler(req, res) {
  console.log('update')
  console.log(req.query.pad)
  res.status(200).json({ success: true })
}