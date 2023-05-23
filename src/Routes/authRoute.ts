import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/emailService";

const router = Router();
const prisma = new PrismaClient();
const EMAIL_EXPIRATION_IN_MINS = 10;
const AUTHENTICATION_TOKEN_EXPIRATION_HOURS = 12;
const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";

function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}
function generateAuthToken(token: number): string {
  const jwtTokenPayload = { token };
  return jwt.sign(jwtTokenPayload, JWT_SECRET, {
    algorithm: "HS512",
    noTimestamp: true,
  });
}

//login or create user
//generate email token
router.post("/login", async (req, res) => {
  const { email } = req.body;
  //token generaton
  const emailToken = generateEmailToken();

  const expiration = new Date(
    new Date().getTime() + EMAIL_EXPIRATION_IN_MINS * 60 * 1000
  );
  try {
    await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: { email: email },
            create: { email },
          },
        },
      },
    });
    sendEmail(email, emailToken);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400).json({ Error: "Something bad happend" });
  }
});

//validate email token
// generate a long lived jwt
router.post("/authenticate", async (req, res) => {
  const { email, emailToken } = req.body;
  console.log(email, emailToken);
  const dbEmailToken = await prisma.token.findUnique({
    where: { emailToken },
    include: {
      user: true,
    },
  });

  if (!dbEmailToken || !dbEmailToken.valid) {
    return res.sendStatus(401);
  }

  if (dbEmailToken.expiration < new Date()) {
    return res.status(401).json({ Error: "Token expired" });
  }

  if (dbEmailToken?.user?.email !== email) {
    return res.sendStatus(401);
  }
  //generate an api token
  const expiration = new Date(
    new Date().getTime() +
      AUTHENTICATION_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000
  );

  const apiToken = await prisma.token.create({
    data: {
      type: "API",
      expiration,
      user: {
        connect: {
          email,
        },
      },
    },
  });

  //invalidate email token
  await prisma.token.update({
    where: { id: dbEmailToken.id },
    data: { valid: false },
  });

  //generate JWT token
  const authToken = generateAuthToken(apiToken.id);

  res.status(200).json({ authToken });
});
export default router;
