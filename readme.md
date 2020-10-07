<h1 align="center">
  <img alt="Logo" src="https://blog.pontte.com.br/wp-content/uploads/2020/02/logo.png" width="200px">
</h1>

<h3 align="center">
  Backend Challenge Pontte
</h3>

<p align="center">Api gestão de contratos de empréstimos.</p>

<p align="center">
  <a href="https://www.linkedin.com/in/juarezsilva/" target="_blank" rel="noopener noreferrer">
    <img alt="Made by" src="https://img.shields.io/badge/made%20by-juarez%20silva-%23FF9000">
  </a>

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/jals990/Pontte-Backend-Challenge?color=%23FF9000">

  <a href="https://github.com/jals990/Pontte-Backend-Challenge/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/jals990/Pontte-Backend-Challenge?color=%23FF9000">
  </a>

  <a href="https://github.com/jals990/Pontte-Backend-Challenge/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/jals990/Pontte-Backend-Challenge?color=%23FF9000">
  </a>

  <img alt="GitHub" src="https://img.shields.io/github/license/jals990/Pontte-Backend-Challenge?color=%23FF9000">
</p>

<p id="insomniaButton" align="center">
  <a href="https://insomnia.rest" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Insomnia"></a>
</p>

## 🧑🏽‍💻 Sobre o projeto

Seu desafio é criar uma aplicação REST para geração, edição e listagem de contratos de emprëstimos. Uma aplicação simples e rápida de ser desenvolvida. Temos alguns requisitos descritos neste documento para ser seguidos. O desenvolvimento deve ser feito em Node.js ou Python, e o banco de dados fica de sua escolha. O uso de bliblioteca que ajude no desenvolvimento fica livre, mas use com parcimonia, queremos validar o seu código e não o seu conhecimento com biblioteca.

Vamos usar esse teste para validar a sua lógica, design da sua solução, código legivel, estruturação do código, entre outros fatores.

Detalhes do desafio, clique aqui: [Desafio](https://github.com/pontte/backend-challenge)<br />
Documentação da API, clique aqui: [API](https://www.notion.so/Pontte-Coding-Challenge-bb23ba10109a4842b51f0303cf308957)

## 🚀 Tecnologias

Tecnologias utilizadas na construção desta API

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [Multer](https://github.com/expressjs/multer)
- [Sequelize](https://sequelize.org)
- [JWT-token](https://jwt.io/)
- [uuid v4](https://github.com/thenativeweb/uuidv4/)
- [PostgreSQL](https://www.postgresql.org/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [EditorConfig](https://editorconfig.org/)

## 💻 Let's Go

Importe o arquivo `Insomnia.json` no app Insomnia, caso não tenha baixe neste link 👉🏾 [Run in Insomnia](#insomniaButton)<br />
Consulte a documentação para entender o uso dessa API 👉🏾 [API](https://www.notion.so/Pontte-Coding-Challenge-bb23ba10109a4842b51f0303cf308957)

## 🧳 Requerimentos

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) ou [npm](https://www.npmjs.com/)
- uma instância [PostgreSQL](https://www.postgresql.org/)

> Obs.: Recomendado utilizar Docker

**Clone o projeto e acesse o diretório**

```bash
$ git clone https://github.com/jals990/Pontte-Backend-Challenge.git && cd backend-pontte
```

> Obs. 2: Certifique-se de não estar utilizando a porta 3333, caso esteja, altere no aquivo .env a variável APP_PORT antes de executar o último comando (yarn dev)

**Próximos passos**

```bash
# Instale as dependências
$ yarn

# Criando a instância do Postgres no Docker
$ docker run --name pontte -e POSTGRES_PASSWORD=pontte -p 5432:5432 -d postgres:11

# Necessário rodar o comando abaixo para criar as tabelas no Postgres
$ yarn sequelize db:migrate

# Para iniciar a aplicação execute o comando abaixo
$ yarn dev

# 🚀 Server no ar!

Made with 🚀 by Juarez Silva ✌🏾
```
