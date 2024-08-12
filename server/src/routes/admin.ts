import express, { Request, Response } from 'express';
import { z, ZodSchema } from 'zod';
import jwt from 'jsonwebtoken';
const JWT_PASSWORD = "ajsdghagsdaskdh";
import { authMiddleware } from '../middleware/middleware';
import { PrismaClient } from '@prisma/client';
const prisma=new PrismaClient();

// Define Zod schemas
const signupSchema: ZodSchema = z.object({
  userName: z.string(),
  password: z.string().min(6)
});

const signinSchema: ZodSchema = z.object({
  userName: z.string(),
  password: z.string().min(6)
});

const router = express.Router();

router.use(express.json());

router.post('/signup',async (req: Request, res: Response) => {
  const parseResult = signupSchema.safeParse(req.body);
  console.log(parseResult);
  if (!parseResult.success) {
    return res.status(411).json("already taken / Incorrect inputs");
  }

  const { userName, password } = parseResult.data;
  const userExists = await prisma.admin.findFirst({
    where:{
      userName
    }
  })
  if (userExists) {
    return res.status(411).json("Email already taken / Incorrect inputs");
  }

  try {
    const userDB = await prisma.admin.create({
      data:{
        userName,password
      }
    })
    console.log(userDB);
    const token = jwt.sign({ userName }, JWT_PASSWORD);
    return res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    return res.status(411).json("Error creating user");
  }
});

router.post('/signin',async (req: Request, res: Response) => {
  const parseResult = signinSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(411).json('Send valid credentials');
  }

  const { userName, password } = parseResult.data;
  const userDB = await prisma.admin.findFirst({where:{ userName, password }});
  if (!userDB) {
    return res.status(411).json({ message: "Error while logging in" });
  }

  const token = jwt.sign({ userName }, JWT_PASSWORD);
  return res.status(201).json({ token });
});


router.get('/authenticate',authMiddleware, async (req: Request, res: Response) => {
  return res.status(200).json("logged in successfully");
});



export default router;
