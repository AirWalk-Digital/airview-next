import { getBusinessUnits } from '../../../backend/business-units';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const applications = getBusinessUnits();
    res.status(200).json(applications);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
