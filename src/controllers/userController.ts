import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};
