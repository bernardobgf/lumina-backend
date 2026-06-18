import express from "express";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import cors from "cors";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import chatRouter from "./routes/chat.routes";
// import exerciseRouter from "./routes/exercise.routes";
import pool from "./database";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: "*" }));

//ROUTES
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/lumina", chatRouter);
// app.use("/exercises", exerciseRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

//TESTANDO CONEXAO COM BANCO
const testConn = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Banco conectado");
  } catch (err) {
    console.log("Erro na conexao:", err);
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

testConn();
