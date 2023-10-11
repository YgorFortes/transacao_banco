import { Router } from "express";
import UsuariosController from "../controller/UsuariosController.js";
const router = Router();

router
.post('/usuario', UsuariosController.cadastrarUsuario)
.post('/login', UsuariosController.login)

export default router;