const express = require("express");
const uuid = require("uuid");
const port = 3000;

const app = express();
app.use(express.json());


const users = [];

const checkUserId = (request, response, next) => {
  const { id } = request.params;

  const index = users.findIndex((user) => user.id === id);

  if (index < 0) {
    return response.status(404).json({ message: "User not Found" });
  }

  request.userIndex = index;
  request.userId = id;

  next();
};


const checkOrderIdExistence = (request, response, next) => {
  const { id } = request.params;

  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return response.status(404).json({ message: "Order not found" });
  }

  request.userIndex = index;
  next();
};

const logRequest = (request, response, next) => {
  console.log(`Method: ${request.method}, URL: ${request.url}`);
  next();
};

app.use("/order/:id", checkOrderIdExistence);
app.use(logRequest);




app.get("/order", (request, response) => {
  response.json(users);
});

app.post("/order", (request, response) => {
  const { order, clientName, price } = request.body;

  const user = { id: uuid.v4(), order, clientName, price, status: "Em Preparação" };

  users.push(user);

  return response.status(201).json(user);
});

app.put("/order/:id", checkUserId, (request, response) => {
  const { order, clientName, price } = request.body;
  const index = request.userIndex;
  const id = request.userId;

  const updateUser = { id, order, clientName, price, status: "Dados Atualizados" };

  users[index] = updateUser;

  return response.json(updateUser);
});

app.delete("/order/:id", (request, response) => {
  const index = request.userIndex;

  users.splice(index, 1);

  return response.status(204).json();
});

app.get("/order/:id", (request, response) => {
  const { userIndex } = request; // Obtém o índice do pedido do middleware
  const specificOrder = users[userIndex]; // Obtém o pedido específico
  return response.json(specificOrder);
});

app.patch("/order/:id", checkOrderIdExistence, (request, response) => {
    const { userIndex } = request;
  
    // Atualize o status para "Pronto"
    users[userIndex].status = "Pronto";
  
    const updatedOrder = users[userIndex]; // Pedido atualizado
  
    return response.status(200).json([updatedOrder]); // Retorna o pedido atualizado em um array
  });
  
  








app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
