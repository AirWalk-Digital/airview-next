export default function handler(req, res) {
  const environmentVariables = {
    ETHERPAD_URL: process.env.ETHERPAD_URL,
  };

  res.status(200).json(environmentVariables);
}
