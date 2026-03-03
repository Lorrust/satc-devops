# 🌙 Nocta

Nocta is a minimal Pomodoro-style study sprint timer built with React and Next.js.

This project was created for a DevOps course, where the main objective is to design and implement a complete CI/CD pipeline and deployment workflow. The frontend application serves as a lightweight vehicle to demonstrate DevOps practices.

## 📌 Project Purpose

The primary goal of this project is not frontend complexity, but:

- Implementing CI pipelines

- Automating builds and tests

- Containerization with Docker

- Continuous Integration / Continuous Deployment

- Environment configuration

- Version control workflows

- Infrastructure and deployment processes

## 🧠 Features

- 25-minute focus timer

- 5-minute break timer

- Start / Pause / Reset controls

- Session counter

- Clean and minimal UI

- Local state management

## 🛠️ Tech Stack

- React

- Next.js

- Node.js

- Docker

- CI/CD Pipeline

## 🚀 Getting Started

1. Clone the repository

```bash
git clone https://github.com/Lorrust/satc-devops.git
cd nocta
```

2. Install dependencies

```bash
npm install
```

3. Run development server

```bash
npm run dev
```

Application runs at:

```bash
http://localhost:3000
```

🐳 Docker

1. Build the container:

```bash
docker build -t nocta .
```

2. Run the container:

```bash
docker run -p 3000:3000 nocta
```
