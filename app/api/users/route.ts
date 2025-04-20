// /pages/api/users.ts
import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") return res.status(405).end();

    const { id, email } = req.body;

    if (!id || !email)
        return res.status(400).json({ message: "Missing ID or email" });

    const existing = await prisma.users.findUnique({ where: { id } });

    if (!existing) {
        await prisma.users.create({
            data: {
                id,
                email,
                full_name: "", // fill in later if you want
            },
        });
    }

    return res.status(200).json({ message: "User synced" });
}
