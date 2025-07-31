import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const createUser = async (req:Request, res:Response)=> {

  const {name, email, password} = req.body

  if (!name || !email || !password) {
    res.status(400).json({error: "Fill all the inputs in the form"})
  }

  try {
    const userAlreadyCreate = await prisma.user.findUnique({where:{email}})
    if(userAlreadyCreate) {
      res.status(409).json({error:'The email was already created'})
    }
    const createUser = await prisma.user.create({
      data:{
        name,
        email,
        password
      }
    })
    res.status(201).json({
      id: createUser.id,
      name: createUser.name,
      email: createUser.email,
      createdAt: createUser.createdAt,
    });

  }catch(err){
    console.error('Error al crear usuario:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
}