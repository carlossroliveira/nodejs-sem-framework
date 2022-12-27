const http = require("http");
const { randomUUID } = require("crypto");
const { Console } = require("console");

/* 
  GET: Buscar um dado
  POST: Inserir um dado
  PUT: Alterar um dado
  DELETE: Remover um dado
*/

const list = [];

const server = http.createServer((request, response) => {
  if (request.url === "/users") {
    if (request.method === "GET") {
      return response.end(JSON.stringify(list));
    }

    if (request.method === "POST") {
      request
        .on("data", (data) => {
          const dataUser = JSON.parse(data);

          const user = {
            id: randomUUID(),
            ...dataUser,
          };

          list.push(user);
        })
        .once("end", () => {
          return response.end(JSON.stringify(list));
        });
    }
  }

  if (request.url.startsWith("/users")) {
    if (request.method === "PUT") {
      const url = request.url;
      const splitUrl = url.split("/");
      const userId = splitUrl[2];

      const useIndex = list.findIndex((user) => user.id === userId);

      console.log("Info:", list[useIndex]);

      request.on("data", (data) => {
        const dataUser2 = JSON.parse(data);

        list[useIndex] = {
          id: userId,
          ...dataUser2,
        };
      }).on("end", () => {
        return response.end(JSON.stringify(list));
      })
    }
  }
});

server.listen(4000, () => console.log("Está rodando na porta 4000"));
