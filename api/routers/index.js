import express from "express";
import usuarios from "./usuariosRoute.js"
export default app =>{
  app.get('/',(req, res)=>{
    res.status(200).send({mensagem: 'Servidor funcionado!'});
  });

  app.use(
    express.json(),
    usuarios
  )
}