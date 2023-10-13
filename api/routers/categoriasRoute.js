import { Router } from "express";
import CategoriasController from "../controller/CategoriasController.js";
import verificarToken from "../middleware/verificarToken.js";
const router = Router();

router
.get('/categoria',verificarToken, CategoriasController.listarCategorias)
.get('/categoria/:id',verificarToken, CategoriasController.listarCategoriaPorId)
.post('/categoria', verificarToken, CategoriasController.cadastrarCategoria)
.put('/categoria/:id', verificarToken, CategoriasController.atualizarCategoria)
.delete('/categoria/:id', verificarToken, CategoriasController.excluirCategoria)

export default router;