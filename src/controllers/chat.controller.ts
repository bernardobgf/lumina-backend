import { Request, Response } from "express";
import pool from "../database";
import { generateResponse } from "../services/gemini.service";

export const createChat = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const id = req.user?.id;

    const newChat = await pool.query(
      "insert into chat (user_id,title) values($1,$2) returning id, title, creation_date",
      [id, title],
    );

    res.status(201).json({ chat: newChat.rows[0] });
  } catch (error) {
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

    const chats = await pool.query("select * from chat where user_id=$1", [
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
