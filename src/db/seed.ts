import pool from "../database";

const seed = async () => {
  await pool.query(`
    INSERT INTO subjects (name) VALUES
    ('Matemática'),
    ('Português'),
    ('História'),
    ('Geografia'),
    ('Física'),
    ('Química'),
    ('Biologia'),
    ('Literatura'),
    ('Filosofia'),
    ('Sociologia')
    ON CONFLICT DO NOTHING
  `);
  console.log("Seed concluído");
  process.exit(0);
};

seed();
