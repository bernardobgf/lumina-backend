import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getChatMessages,
  getChats,
  createChat,
  createMessage,
  updateChatTitle,
  deleteChat,
} from "../controllers/chat.controller";

const router = Router();

router.get("/chats", authMiddleware, getChats);
router.get("/chats/:chatId/messages", authMiddleware, getChatMessages);
router.post("/chats/:chatId/messages", authMiddleware, createMessage);
router.post("/new-chat", authMiddleware, createChat);
router.put("/chats/:chatId", authMiddleware, updateChatTitle);

router.delete("/chats/:chatId", authMiddleware, deleteChat);

export default router;
