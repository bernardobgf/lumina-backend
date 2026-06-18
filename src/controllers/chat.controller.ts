import { Request, Response } from "express";
import pool from "../database";
import { generateResponse } from "../services/gemini.service";

export const createChat = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const id = req.user?.id;

    const newChat = await pool.query(
      "insert into chats (user_id,title) values($1,$2) returning id, title, creation_date",
      [id, title],
    );

    res.status(201).json({ chat: newChat.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;

    const chatSelected = await pool.query(
      "select * from messages where chat_id = $1",
      [chatId],
    );

    res.status(200).json({ messages: chatSelected.rows });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id;

    const chats = await pool.query("select * from chats where user_id=$1", [
      user_id,
    ]);

    res.status(200).json({ chats: chats.rows, chatNumer: chats.rows.length });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const { chatId } = req.params;

    const studentMessage = await pool.query(
      "insert into messages(chat_id,sender,content) values ($1,$2,$3) returning id,sender, content, send_date",
      [chatId, "user", content],
    );

    const luminaResponse = await generateResponse(content as string);

    const luminaMessage = await pool.query(
      "insert into messages(chat_id,sender,content) values($1,$2,$3) returning id,sender,content,send_date",
      [chatId, "lumina", luminaResponse],
    );

    res.status(201).json({
      studentMessages: studentMessage.rows,
      luminaMessages: luminaMessage.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const updateChatTitle = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;
    const userId = req.user?.id;

    const result = await pool.query(
      `
      UPDATE chats
      SET title = $1
      WHERE id = $2 AND user_id = $3
      RETURNING id, title
      `,
      [title, chatId, userId],
    );

    if (!result.rowCount) {
      return res.status(404).json({
        error: "Chat não encontrado",
      });
    }

    res.status(200).json({
      chat: result.rows[0],
      message: "Título atualizado com sucesso",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Erro interno no servidor",
    });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.id;

    await pool.query("DELETE FROM messages WHERE chat_id = $1", [chatId]);

    const result = await pool.query(
      `
      DELETE FROM chats
      WHERE id = $1 AND user_id = $2
      RETURNING id
      `,
      [chatId, userId],
    );

    if (!result.rowCount) {
      return res.status(404).json({
        error: "Chat não encontrado",
      });
    }

    res.status(200).json({
      message: "Chat removido com sucesso",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Erro interno no servidor",
    });
  }
};
