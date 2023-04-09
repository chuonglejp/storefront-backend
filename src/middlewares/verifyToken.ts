require('../utils/env');
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const { 
  JWT_SECRET
} =  process.env;

export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) throw new Error('invalid jwt');
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
    // TODO save payload of jwt to somewhere

    next()
  } catch (error) {
    console.error(`verifyAuthToken error. ${error}`);
    res.status(401)
  }
}