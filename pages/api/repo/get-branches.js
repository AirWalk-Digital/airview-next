// /pages/api/branches.js
import { getBranches } from "@/lib/github";

export default async (req, res) => {
    try {
        if (req && req.query && req.query.owner && req.query.repo) {
            const branches = await getBranches(req.query.owner, req.query.repo);
            res.status(200).json(branches);
        } else {
            res.status(500).json({ error: 'missing owner & repo' });    
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};