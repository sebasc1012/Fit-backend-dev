import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


interface JwtPayload {
  userId:string;
  email:string;
}

const JWT_SECRET = process.env.JWT_SECRET || "supersecreta";

export const verifyToken = (req:Request, res:Response, next:NextFunction)=> {

  const authorizationToken = req.headers.authorization

  if(!authorizationToken || authorizationToken.startsWith('Barer ')){
    res.status(401).json({error:"Missing Token"})
  }

  if(!authorizationToken)return
  const token = authorizationToken.split(' ')[1]

  try{
    const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;

// @ts-ignore - agregamos usuario al request para uso posterior
    req.user = {
      id:decode.userId,
      email:decode.email
    }

    next()

  }catch(err){
    console.error(err);
    res.status(500).json({error: "Internal error "})
    

  }

}