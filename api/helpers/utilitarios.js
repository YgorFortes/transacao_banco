function verificaCamposEmBranco(req,res, ...campos){
  for (let campo of campos){
    if(!req[campo]){
      return res.status(400).send({mensagem: `Campo ${campo} vazio. Digite o campo`}) ;
    }
  }
  
}

export default verificaCamposEmBranco