const http = require("http");
const { randomUUID } = require("crypto");

/* 
  GET: Buscar um dado
  POST: Inserir um dado
  PUT: Alterar um dado
  DELETE: Remover um dado
*/

const listOfPerson = [];

const server = http.createServer((request, response) => {
  const url = request.url.split("/")[2];

  if (request.url === "/users" && request.method === "GET") {
    return response.end(JSON.stringify(listOfPerson));
  }

  if (request.url === "/users" && request.method === "POST") {
    request
      .on("data", (data) => {
        const dataUser = JSON.parse(data);

        const user = {
          id: randomUUID(),
          ...dataUser,
        };

        listOfPerson.push(user);
      })
      .on("end", () => {
        return response.end(JSON.stringify(listOfPerson));
      });
  }

  if (request.url.startsWith("/users") && request.method === "PUT") {
    const useIndex = listOfPerson.findIndex((user) => user.id === url);

    request
      .on("data", (data) => {
        const dataUser2 = JSON.parse(data);

        listOfPerson[useIndex] = {
          id: url,
          ...dataUser2,
        };
      })
      .on("end", () => {
        return response.end(JSON.stringify(listOfPerson));
      });
  }

  if (request.url.startsWith("/users") && request.method === "DELETE") {
    const useIndex = listOfPerson.findIndex((user) => user.id === url);

    request
      .on("data", () => {
        listOfPerson[useIndex] = [];
      })
      .on("end", () => {
        return response.end(JSON.stringify(listOfPerson));
      });
  }
});

server.listen(4000, () => console.log("Está rodando na porta 4000"));
