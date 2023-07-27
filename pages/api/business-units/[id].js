// pages/api/applications/[id].js

import { getBusinessUnitById } from '../../../backend/business-units';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    const application = getBusinessUnitById(id);

    if (application) {
      res.status(200).json(application);
    } else {
      res.status(404).json({ error: 'Bussiness Unit not found' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
