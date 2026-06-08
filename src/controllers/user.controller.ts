import { Request, Response } from "express";
import pool from "../database";
import bcrypt from "bcrypt";

export const profileSettings = async (req: Request, res: Response) => {
  try {
    const { nickname, email, profile_pic } = req.body;
    const fields = [];
    const values = [];
    let count = 1;

    if (nickname) {
      fields.push(`nickname= $${count++}`);
      values.push(nickname);
    }
    if (email) {
      fields.push(`email= $${count++}`);
      values.push(email);
    }
    if (profile_pic) {
      fields.push(`profile_pic= $${count++}`);
      values.push(profile_pic);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "Nenhum campo para atualizar" });
    }

    values.push(req.user?.id);

    const updated = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${count} RETURNING nickname, email, profile_pic`,
      values,
    );

    res.status(200).json({ user: updated.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { lastPassword, newPassword } = req.body;
    const id = req.user?.id;

    const oldHashPassword = await pool.query(
      "select password from users where id = $1",
      [id],
    );

    const match = await bcrypt.compare(
      lastPassword,
      oldHashPassword.rows[0].password,
    );

    if (!match) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashNewPassword = await bcrypt.hash(newPassword, salt);

    const passwordChanged = await pool.query(
      "update users set password = $1 where id=$2",
      [hashNewPassword, id],
    );

    res.status(200).json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
