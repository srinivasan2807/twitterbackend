import { PrismaClient, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";
const prisma = new PrismaClient();
type AuthRequest = Request & { user?: User };
export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }
  //decode token
  try {
    const payload = (await jwt.verify(token, JWT_SECRET)) as {
      token: number;
    };
    const dbToken = await prisma.token.findUnique({
      where: { id: payload.token },
      include: { user: true },
    });
    if (!dbToken?.valid || dbToken?.expiration < new Date()) {
      return res.status(401).json({ Error: "API Token Expired!" });
    }
    req.user = dbToken.user;
    
  } catch (error) {
    return res.sendStatus(401);
  }
  next();
}
