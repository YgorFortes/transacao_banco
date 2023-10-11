import { Router } from "express";
import UsuariosController from "../controller/UsuariosController.js";
const router = Router();

router
.post('/usuario', UsuariosController.cadastrarUsuario)

export default router;