import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("API rodando na porta 3000");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});