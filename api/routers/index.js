import express from "express";
import usuarios from "./usuariosRoute.js";
import categorias from "./categoriasRoute.js";
export default app =>{
  app.get('/',(req, res)=>{
    res.status(200).send({mensagem: 'Servidor funcionado!'});
  });

  app.use(
    express.json(),
    usuarios,
    categorias
  )
}