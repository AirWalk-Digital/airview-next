import { getApplications } from '../../../backend/applications';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const applications = getApplications();
    res.status(200).json(applications);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
