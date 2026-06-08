import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Acesso negado. Token invalido ou nao fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as JwtPayload;
    next();
  } catch (err) {
    res.status(400).json({ error: "Token invalido" });
  }
};

export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  authMiddleware(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }
    next();
  });
};
