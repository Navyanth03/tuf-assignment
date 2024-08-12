import express, { Request, Response } from 'express';
import { z, ZodSchema } from 'zod';
import { PrismaClient } from '@prisma/client';
const prisma=new PrismaClient();


// Define Zod schemas
const signupSchema: ZodSchema = z.object({
  isVisible: z.boolean(),
  title: z.string(),
  timer: z.number(),
  link: z.string(),
});


const router = express.Router();

router.use(express.json());

router.post('/putbanner', async (req: Request, res: Response) => {
  const parseResult = signupSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(411).json("already taken / Incorrect inputs");
  }

  const { isVisible, title, timer, link } = parseResult.data;
  try {
    const newBanner = await prisma.banner.create({
      data:{
        isVisible,title,timer, link
      }
    })
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(411).json("Error creating user");
  }
});

router.get('/getbanner', async (req: Request, res: Response) => {
  try {
    const newBanner = await prisma.banner.findFirst({
      where:{
        id:1
      }
    })
    return res.status(201).json({ newBanner });
  } catch (error) {
    return res.status(411).json("Error fecthing banner");
  }
});

router.post('/updatebanner', async (req: Request, res: Response) => {
  const parseResult = signupSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(411).json("Incorrect inputs");
  }
  const { isVisible, title, timer, link } = parseResult.data;
  try {
    const newBanner = await prisma.banner.update({
      where:{ id:1 },
      data:{
        isVisible,title,timer,link
      }
    })
    return res.status(201).json({ newBanner });
  } catch (error) {
    return res.status(411).json("Error updating banner");
  }
});

export default router;
