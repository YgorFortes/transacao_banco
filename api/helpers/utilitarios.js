import jwt  from 'jsonwebtoken';
function verificaCamposEmBranco(req, ...campos){
  let  mensagem ;
  for (let campo of campos){
    if(!req[campo]){
      return mensagem =  `O campo ${campo} está vazio. Por favor, preencha o campo ${campo}.`;
    }
  }
  
}

async function resgatarIdUsuarioPorToken(req){
  const secret = process.env.SECRET;
  const token = req.get('authorization').split(' ')[1];
  const idUsario = await jwt.verify(token, secret).id;
  return idUsario;
}

export default {
  verificaCamposEmBranco, 
  resgatarIdUsuarioPorToken
}