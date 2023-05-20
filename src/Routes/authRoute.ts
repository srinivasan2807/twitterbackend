import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();
const EMAIL_EXPIRATION_IN_MINS = 10;
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
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
    const createdToken = await prisma.token.create({
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
    console.log(createdToken);
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

  console.log(dbEmailToken);

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
  
  res.sendStatus(200);
});
export default router;
