// /pages/api/branches.js
import { getBranches, createBranch } from "@/lib/github";

export default async (req, res) => {
    try {
        if (req.method === "GET") {
            // Handle GET request
            if (req.query.owner && req.query.repo) {
                const branches = await getBranches(req.query.owner, req.query.repo);
                res.status(200).json(branches);
            } else {
                res.status(400).json({ error: 'Missing owner & repo parameters' });    
            }
        } else if (req.method === "POST") {
            // Handle POST request
            const { owner, repo, branch, sourceBranch } = req.body;
            if (owner && repo && branch && sourceBranch) {
                const response = await createBranch(owner, repo, branch, sourceBranch);
                res.status(201).json(response); // 201 status code for resource creation
            } else {
                res.status(400).json({ error: 'Missing required parameters: owner, repo, branch, or sourceBranch' });
            }
        } else {
            // Handle unsupported methods
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
