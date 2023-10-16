import { Router } from "express";
import TransacoesController from "../controller/TransacoesController.js";
import verificarToken from "../middleware/verificarToken.js";
const router = Router();

router.get('/transacao',verificarToken, TransacoesController.listarTransacoes)

export default router;
