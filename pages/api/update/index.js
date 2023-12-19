// update Cache

export default async function handler(req, res) {
  try {
    res.status(200).json({ status: "success" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "error in api (/api/update): " + error,
      });
  }
}
