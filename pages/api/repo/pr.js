// /pages/api/pullRequests.js
import { createPR } from "@/lib/github";

export default async (req, res) => {
    try {
        if (req.method === "POST") {
            // Handle POST request
            const { owner, repo, title, body, head, base } = req.body;
            if (owner && repo && title && body && head && base) {
                const response = await createPR(owner, repo, title, body, head, base);
                res.status(201).json(response); // 201 status code for resource creation
            } else {
                res.status(400).json({ error: 'Missing required parameters: owner, repo, title, body, head, or base' });
            }
        } else {
            // Handle unsupported methods
            res.setHeader('Allow', ['POST']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};