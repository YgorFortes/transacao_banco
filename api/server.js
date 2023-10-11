import express from "express";
import 'dotenv/config';
import routers from "./routers/index.js";

const app = express();
const port = process.env.PORT || 3000;

routers(app);





app.listen(port, ()=> console.log(`Servidor funcionando na porta http://localhost:${port}/`));
