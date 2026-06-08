import pool from "../database";
import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, password, email } = req.body;

    const result = await pool.query(
      "select email from users where email = $1",
      [email],
    );

    if (result.rowCount && result.rowCount > 0) {
      return res.status(400).json({ erro: "Email ja cadastrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await pool.query(
      "insert into users(name, nickname, email, password) values($1,$1,$3,$2)",
      [name, hashPassword, email],
    );

    res.status(201).json({ message: "Cadastro realizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "select id,role, password from users where email = $1",
      [email],
    );

    if (!result.rowCount) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const match = await bcrypt.compare(password, result.rows[0].password);

    if (!match) {
      return res.status(401).json({ error: "Senha ou email incorretos" });
    }

    //JSON WEB TOKEN
    const payload = { id: result.rows[0].id, role: result.rows[0].role };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .json({ token, message: "Login realizado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.status(200).json({ message: "Logout realizado com sucesso" });
};
