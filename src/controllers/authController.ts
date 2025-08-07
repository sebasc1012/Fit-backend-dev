import { Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecreta";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email, and password are requiered" });
  }

  try {
    const userInfo = await prisma.user.findUnique({ where: { email } });
    if (!userInfo) {
      res.status(401).json({ error: "User not found" });
    }

    if (!userInfo?.password) return;

    const isValidPassword = await bcrypt.compare(password, userInfo.password);
    if (!isValidPassword) {
      res
        .status(401)
        .json({ message: "Incorrect password", error: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: userInfo.id, email: userInfo.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login success",
      token,
      user: {
        name: userInfo.name,
        email: userInfo.email,
        id: userInfo.id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fail to fetch" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "All fields are mandatory" });
  }

  try {
    const validateEmail = await prisma.user.findUnique({ where: { email } });
    if (validateEmail) {
      res.status(409).json({ error: "The user already exist" });
    }
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User succesfully created",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error " });
  }
};
