import { Request, Response } from "express";

export const getUsers = (req:Request, res:Response)=> {

  res.json([
    {id:1, name:"Sebastian Castaño"},
    {id:2, name:"Sebastian Castaño"},
    {id:3, name:"Sebastian Castaño"},
    {id:4, name:"Sebastian Castaño"}
  ])

}