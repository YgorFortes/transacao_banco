import { Router } from "express";
import TransacoesController from "../controller/TransacoesController.js";
import verificarToken from "../middleware/verificarToken.js";
const router = Router();

router
.get('/transacao',verificarToken, TransacoesController.listarTransacoes)
.get('/transacao/:id', verificarToken, TransacoesController.listarTransacaoPorId)
.post('/transacao', verificarToken, TransacoesController.cadastrarTransacao)
.put('/transacao/:id',verificarToken, TransacoesController.atualizarTransacao)
.delete('/transacao/:id', verificarToken, TransacoesController.excluirTransacao)

export default router;
