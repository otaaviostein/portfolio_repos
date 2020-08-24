const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  const { title, url, techs } = request.query;

  const results = title ? repositories.filter(repo => repo.title.includes(title)) : repositories;

  console.log(results);

  return  response.json(results);

});

app.post("/repositories", (request, response) => {
    const { title, url, techs, likes } = request.body;

    const project = { id: uuid(), title, url, likes, techs }

    repositories.push(project);

    return  response.json(repositories);
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const index = repositories.findIndex(repo=> repo.id === id);

    if(index < 0) {
        return response.status(400).json({error: "not found."});
    }

    const repo = {
        id,
        title,
        url,
        techs
    };

    repositories[index] = repo;

    return  response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;

    const index = repositories.findIndex(repo=> repo.id === id);

    if(index < 0) {
        return response.status(400).json({error: "not found"});
    }

    repositories.splice(index, 1);

    return  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;

    const index = repositories.findIndex(repo=> repo.id === id);

    if(index < 0) {
        return response.status(400).json({error: "not found."});
    }

    

    repositories[index].likes ++;

    return  response.json(repositories[index]);
});

module.exports = app;
