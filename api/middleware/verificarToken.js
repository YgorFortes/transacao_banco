import jwt  from 'jsonwebtoken';
import 'dotenv/config';
function verificarToken(req, res, next){
  //Pegando o token no headers
  const tokenHeader = req.headers['authorization'];
  const token = tokenHeader.split(' ')[1];

  //verificando se o token existe
  if(!token){
    return res.statisu(401).send({mensagem: 'Token não existe'});
  }

  try {
    
    //Comparando  token com a chave pública
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();

  } catch (erro) {
    console.log(erro);
    return res.status(401).send({mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado'});
  }
}

export default verificarToken;