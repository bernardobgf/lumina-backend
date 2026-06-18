// import { Request, Response } from "express";
// import pool from "../database";
// import { generateResponse } from "../services/gemini.service";

// export const exercises = async (req: Request, res: Response) => {
//   try {
//     const exercisesList = await pool.query("select * from exercises");

//     res.status(200).json({ exercises: exercisesList.rows });
//   } catch (error) {
//     res.status(500).json({ error: "Erro interno no servidor" });
//   }
// };

// export const generate = async (req: Request, res: Response) => {
//   try {
//     const { subject, difficulty } = req.body;

//     const prompt = `
//     Gere uma questão para um vestibulando em preparação de vestibular de ${subject} com dificuldade ${difficulty}.
//     Responda somente com JSON válido, sem texto extra, no seguinte formato:
//     {
//       "subject": "Matemática",
//       "question": "Qual é o valor de x em 2x + 4 = 10?",
//       "difficulty": "easy",
//       "explication": "Isolando x...",
//       "correct_answer": "A",
//       "alternatives": [
//         { "letter": "A", "text": "x = 3" },
//         { "letter": "B", "text": "x = 4" },
//         { "letter": "C", "text": "x = 5" },
//         { "letter": "D", "text": "x = 2" },
//         { "letter": "E", "text": "x = 6" }
//       ]
//     }
//     `;

//     const luminaGenExercise = await generateResponse(prompt);

//     const luminaGenExerciseParsed = JSON.parse(luminaGenExercise);

//     const materia = await pool.query("select id from subjects where name=$1", [
//       subject,
//     ]);

//     if (!materia.rowCount) {
//       return res.status(400).json({ error: "Materia nao foi encontrada" });
//     }

//     const populateExercise = await pool.query(
//       "insert into exercises(subjects_id,question,difficulty,explication,correct_answer) values($1,$2,$3,$4,$5) returning id,question,difficulty,explication,correct_answer",
//       [
//         materia.rows[0].id,
//         luminaGenExerciseParsed.question,
//         luminaGenExerciseParsed.difficulty,
//         luminaGenExerciseParsed.explication,
//         luminaGenExerciseParsed.correct_answer,
//       ],
//     );

//     for (const alt of luminaGenExerciseParsed.alternatives) {
//       await pool.query(
//         "insert into alternatives(exercises_id,letter,letter_text) values($1,$2,$3)",
//         [populateExercise.rows[0].id, alt.letter, alt.text],
//       );
//     }

//     res.status(201).json({ exercise: populateExercise.rows[0] });
//   } catch (error) {
//     res.status(500).json({ error: "Erro interno no servidor" });
//   }
// };

// export const exerciseAnswer = async (req: Request, res: Response) => {
//   try {
//     const { answer } = req.body;
//     const { exerciseId } = req.params;
//     const id = req.user?.id;

//     const result = await pool.query(
//       "select correct_answer from exercises where id= $1",
//       [exerciseId],
//     );

//     if (!result.rowCount) {
//       return res.status(404).json({ error: "Exercicio nao existe" });
//     }

//     const previousAttempts = await pool.query(
//       "select attempts from progress where users_id = $1 and exercises_id= $2",
//       [id, exerciseId],
//     );

//     const attempts = previousAttempts.rowCount
//       ? previousAttempts.rows[0].attempts + 1
//       : 1;

//     const isCorrect = answer === result.rows[0].correct_answer;

//     await pool.query(
//       "INSERT INTO progress(users_id, exercises_id, user_answer, is_correct, attempts) VALUES($1, $2, $3, $4, $5) ON CONFLICT (users_id, exercises_id) DO UPDATE SET attempts = progress.attempts + 1, user_answer = $3, is_correct = $4",
//       [id, exerciseId, answer, isCorrect, attempts],
//     );

//     if (!isCorrect) {
//       return res.status(400).json({
//         error: "Resposta incorreta",
//         correct: false,
//         attempts: attempts,
//       });
//     }

//     res
//       .status(200)
//       .json({ message: "Resposta correta", correct: true, attempts: attempts });
//   } catch (error) {
//     res.status(500).json({ error: "Erro interno no servidor" });
//   }
// };

// export const deleteExercise = async (req: Request, res: Response) => {
//   try {
//     const { exerciseId } = req.params;

//     const result = await pool.query("delete from exercises where id = $1", [
//       exerciseId,
//     ]);

//     if (!result.rowCount) {
//       return res.status(400).json({ error: "Nenhum exercicio encontrado" });
//     }

//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: "Erro interno no servidor" });
//   }
// };
