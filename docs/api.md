# 🌟 Lumina

Uma plataforma de estudos com Inteligência Artificial voltada para vestibulandos brasileiros.

O Lumina permite que estudantes conversem com uma IA para tirar dúvidas, resolvam exercícios gerados automaticamente e acompanhem seu progresso ao longo dos estudos.

---

# 📖 Visão Geral

O objetivo do Lumina é unir inteligência artificial e educação em uma única plataforma, oferecendo:

- Chat inteligente para dúvidas de estudo
- Geração automática de exercícios
- Correção automática de respostas
- Acompanhamento de progresso
- Sistema de autenticação seguro
- Painel administrativo para gerenciamento de conteúdo

---

# 🛠 Tecnologias Utilizadas

## Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT (JSON Web Token)
- Bcrypt
- Google Gemini API
- Node-Postgres (pg)

## Frontend

- HTML5
- CSS3
- JavaScript
- TailwindCSS

---

# 🏗 Arquitetura

```text
Frontend
    │
    ▼
REST API (Express)
    │
    ├── JWT Authentication
    ├── Gemini AI Service
    │
    ▼
PostgreSQL
```

---

# 🔐 Autenticação

O sistema utiliza JWT para autenticação.

Após o login, um token é gerado contendo:

```json
{
  "id": "user-id",
  "role": "student"
}
```

O token deve ser enviado em todas as rotas protegidas:

```http
Authorization: Bearer TOKEN
```

Validade:

```text
1 dia
```

---

# 👤 Auth Endpoints

## POST /auth/register

Realiza o cadastro de um novo usuário.

### Request

```json
{
  "name": "Bernardo",
  "email": "bernardo@email.com",
  "password": "123456"
}
```

### Regras

- Email deve ser único
- Senha é armazenada utilizando bcrypt
- Nickname é criado automaticamente com o mesmo valor do nome

### Response 201

```json
{
  "message": "Cadastro realizado com sucesso!"
}
```

### Response 400

```json
{
  "erro": "Email ja cadastrado"
}
```

---

## POST /auth/login

Autentica um usuário.

### Request

```json
{
  "email": "bernardo@email.com",
  "password": "123456"
}
```

### Response 200

```json
{
  "token": "jwt-token",
  "message": "Login realizado com sucesso"
}
```

### Response 401

```json
{
  "error": "Email ou senha incorretos"
}
```

---

## POST /auth/logout

Realiza logout do usuário.

### Response 200

```json
{
  "message": "Logout realizado com sucesso"
}
```

Observação:

O logout é realizado no cliente removendo o token armazenado.

---

# 👤 User Endpoints

Rotas protegidas por JWT.

---

## PATCH /users/profile

Atualiza informações do perfil.

Todos os campos são opcionais.

### Request

```json
{
  "nickname": "BernardoDev",
  "email": "novo@email.com",
  "profile_pic": "https://imagem.com/foto.png"
}
```

### Response 200

```json
{
  "user": {
    "nickname": "BernardoDev",
    "email": "novo@email.com",
    "profile_pic": "https://imagem.com/foto.png"
  }
}
```

### Response 400

```json
{
  "error": "Nenhum campo para atualizar"
}
```

---

## PATCH /users/change-password

Altera a senha do usuário.

### Request

```json
{
  "lastPassword": "senhaAntiga",
  "newPassword": "senhaNova"
}
```

### Response 200

```json
{
  "message": "Senha alterada com sucesso"
}
```

### Response 400

```json
{
  "error": "Senha incorreta"
}
```

---

# 💬 Chat Endpoints

Rotas protegidas por JWT.

---

## POST /lumina/new-chat

Cria um novo chat.

### Request

```json
{
  "title": "Matemática"
}
```

### Response 201

```json
{
  "chat": {
    "id": "uuid",
    "title": "Matemática",
    "creation_date": "2026-01-01"
  }
}
```

---

## GET /lumina/chats

Lista todos os chats do usuário autenticado.

### Response 200

```json
{
  "chats": [],
  "chatNumer": 0
}
```

---

## GET /lumina/chats/:chatId/messages

Busca todas as mensagens de um chat.

### Response 200

```json
{
  "messages": []
}
```

---

## POST /lumina/chats/:chatId/messages

Envia uma mensagem para a IA.

### Request

```json
{
  "content": "Explique regra de três"
}
```

### Fluxo

1. Mensagem do estudante é salva.
2. Prompt é enviado ao Gemini.
3. Resposta da IA é salva.
4. Ambas são retornadas.

### Response 201

```json
{
  "studentMessages": [],
  "luminaMessages": []
}
```

---

# 📚 Exercise Endpoints

Rotas protegidas por JWT.

---

## GET /exercises

Lista exercícios cadastrados.

### Response 200

```json
{
  "exercises": []
}
```

---

## POST /exercises/generate

Gera automaticamente um exercício utilizando Gemini.

### Request

```json
{
  "subject": "Matemática",
  "difficulty": "easy"
}
```

### Fluxo

1. Gemini gera questão em JSON.
2. Exercício é salvo.
3. Alternativas são salvas.
4. Exercício é retornado.

### Response 201

```json
{
  "exercise": {
    "id": "uuid",
    "question": "...",
    "difficulty": "easy",
    "explication": "...",
    "correct_answer": "A"
  }
}
```

---

## POST /exercises/:exerciseId/answer

Submete resposta de um exercício.

### Request

```json
{
  "answer": "A"
}
```

### Response Correta

```json
{
  "message": "Resposta correta",
  "correct": true,
  "attempts": 1
}
```

### Response Incorreta

```json
{
  "error": "Resposta incorreta",
  "correct": false,
  "attempts": 1
}
```

### Response 404

```json
{
  "error": "Exercicio nao existe"
}
```

---

## DELETE /exercises/:exerciseId

Remove um exercício.

### Response 204

```http
No Content
```

### Response 400

```json
{
  "error": "Nenhum exercicio encontrado"
}
```

---

# 🤖 Integração com IA

O Lumina utiliza a API do Google Gemini para:

## Chat

Gerar respostas para dúvidas dos estudantes.

## Exercícios

Gerar automaticamente:

- Questões
- Alternativas
- Resposta correta
- Explicação da resolução

Os exercícios são gerados em formato JSON e armazenados no PostgreSQL.

---

# 🗄 Estrutura do Banco de Dados

Principais entidades:

## users

Armazena usuários do sistema.

## chat

Armazena conversas criadas pelos usuários.

## messages

Armazena mensagens dos chats.

## subjects

Matérias disponíveis.

## exercises

Questões geradas pela IA.

## alternatives

Alternativas dos exercícios.

## progress

Histórico de respostas dos usuários.

---

# 🚀 Como Executar

## Instalar dependências

```bash
npm install
```

## Configurar .env

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=lumina
DB_USER=postgres
DB_PASSWORD=sua_senha

JWT_SECRET=seu_secret

GEMINI_API_KEY=sua_chave
```

## Executar

```bash
npm run dev
```

---

# 🔮 Melhorias Futuras

- Dashboard de desempenho
- Estatísticas por matéria
- Sistema de ranking
- Gamificação
- Flashcards inteligentes
- Upload de PDFs
- Histórico avançado de progresso
- Aplicação React/Next.js
- Aplicativo mobile
- Recomendação personalizada de exercícios

---

# 👨‍💻 Autor

Desenvolvido por Bernardo Bregeron Flores.

Projeto criado para aprendizado, portfólio e evolução profissional.
