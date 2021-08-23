import Ocurrence from './../models/ocurrence'


class OcurrenceController{


  async post(req,res) {
    req.body.user_id = req.user._id;
    req.body.ocurred_at = new Date(req.body.ocurred_at);
    Ocurrence.create(req.body)
    .then(data=>{
      res.send(data)
    })
    .catch(err=>{
      res.status(400).send(err);
    })
  }

  async get(req,res) {
    return await Ocurrence.find({hidden:false},{__v:0},{lean:true})
    .sort({created_at:-1, 'comments.created_at':-1})
    .populate('user_id', {name:1, _id:1},'User')
    .populate('comments._user', {name:1, _id:1},'User')
    
    .then(async data=>{

      data = await data.map(item=>{
        if(item.anonymous){
          delete item.user_id;
        }else{
          item.user_name = item.user_id.name;
          item.user_id = item.user_id._id;
        }
        item.ocurred_at = item.ocurred_at.getTime();
       item.positiveVotes = item.votes?.filter((vote)=> vote.vote == true)?.length;
       item.negativeVotes = item.votes?.filter((vote)=> vote.vote == false)?.length;
       item.iVoted = item.votes?.find((vote)=>  vote._user.toString() == req.user._id.toString());
       
        return item;
      })
      res.send(data);
    })
    .catch(err=> {res.status(400).send(err); console.log(err)})
  }


  async getMyOcurrences(req,res) {
    return await Ocurrence.find({user_id: req.user._id },{__v:0},{lean:true})
    .sort({created_at:-1})
    // .populate('user_id', {name:1, _id:1},'User')
    .then(async data=>{
      data = await data.map(item =>{
        item.ocurred_at = item.ocurred_at.getTime();
        return item;
      })
      res.send(data);
    })
    .catch(err=> res.status(400).send(err))
  }

  async getById(req,res) {
    return await Ocurrence.findOne({_id: req.params.id },{__v:0},{lean:true})
    .populate('user_id', {name:1, _id:1},'User')
    .then(async data=>{
      if(data){
        if(data.anonymous){
          delete data.user_id;
        }else{
          data.user_name = data.user_id.name;
          data.user_id = data.user_id._id;
        }
        data.ocurred_at = data.ocurred_at.getTime();

        res.send(data);
      }else{
        res.status(404).send({error:"Ocorrência não encontrada!"});
      }
    })
    .catch(err=> res.status(400).send(err))
  }

  async update(req,res){
    return await Ocurrence.findOne({_id:req.params.id})
    .then(async data=>{
      if(data){
        if(data.user_id.equals(req.user._id) || req.user.role == 'admin'){
          return await Ocurrence.findOneAndUpdate({_id:req.params.id}, {$set:req.body},{new:true})
          .then(async data=>{
            res.send(data);
          })
          .catch(err=> res.status(400).send({error:'Não foi possível atualizar a ocorrência',err:err}));
        }else{
          res.status(403).send({error:'Você não pode editar essa ocorrência!'});
        }
      }else{
        res.status(404).send({error:'Ocorrência não encontrada!'})
      }
    })
    .catch(err=> res.status(400).send({error:'Não foi possível atualizar a ocorrência',err:err}))

  }

  async delete(req,res){

    return await Ocurrence.findOne({_id:req.params.id},{},{lean:true})
    .then(async data=>{
      if(data){
        // console.log(data.user_id)
        console.log(data.user_id.equals(req.user._id))
        if(data.user_id.equals(req.user._id) || req.user.role == 'admin'){
          return await Ocurrence.deleteOne({_id:req.params.id})
          .then(async data=>{
            res.send({status:"Excluído com sucesso"});
          })
          .catch(err=> res.status(400).send({error: 'Não foi possível excluír a ocorrência',err:err}))
        }else{
          res.status(403).send({error:'Você não pode excluír essa ocorrência!'});
        }
      }else{
        res.status(404).send({error:'Ocorrência não encontrada!'})
      }
    })
    .catch(err=> res.status(400).send({error:'Não foi possível atualizar a ocorrência',err:err}))



  }

  async vote(req,res) {
    let ocurrence =  await Ocurrence.findOne({_id: req.params.id});
    if(ocurrence){
      if(ocurrence._user != req.user._id){
        let userAlreadyVoted = await Ocurrence.findOne({_id: ocurrence._id, 'votes._user':req.user._id});
        console.log(userAlreadyVoted);
        if(userAlreadyVoted){
          await Ocurrence.updateOne({_id: ocurrence._id, 'votes._user':req.user._id}, {$set: {votes:{_user: req.user._id, vote: req.body.vote}}});
        }else{
          await Ocurrence.updateOne({_id: ocurrence._id}, {$push: {votes:{_user: req.user._id, vote: req.body.vote}}});
        }
        let ocurrenceUpdated = await Ocurrence.findOne({_id:ocurrence._id});
        let positiveVotes = ocurrenceUpdated.votes.filter((vote)=> vote.vote == true).length;
        let negativeVotes = ocurrenceUpdated.votes.filter((vote)=> vote.vote == false).length;
        let totalVotes = positiveVotes+negativeVotes;

        if(totalVotes > 20){
          if(negativeVotes/totalVotes >= 0.7){
            await Ocurrence.updateOne({_id:ocurrence._id},{$set:{hidden:true}});
          }
        }

        res.send({positiveVotes, negativeVotes});
      }else{
        res.status(400).send({error:'Você não pode votar na própria ocorrência'});
      }
    }else{
      res.status(404).send({error:'Não foi possível votar na ocorrência.',})
    }
  }

  async comment(req,res) {
    let ocurrence = await Ocurrence.findOne({_id: req.params.id});
    if(ocurrence) {
      await Ocurrence.updateOne({_id: ocurrence._id}, {$push:{comments:{text: req.body.text, _user: req.user._id}}});
      res.status(200).send({});
    }else{
      res.status(400).send({error:'Não foi possível adicionar o comentário'});
    }
  }

  async deleteComment(req,res) {
    let ocurrence = await Ocurrence.findOne({_id: req.params.id});
    if(ocurrence) {


      await Ocurrence.updateOne({_id: ocurrence._id, comments:{$elemMatch:{_id: req.params.comment_id, _user: req.user._id}}}, {$pull:{comments:{_id: req.params.comment_id}}});
      res.status(200).send({});
    }else{
      res.status(400).send({error:'Não foi possível adicionar o comentário'});
    }
  }

}

export default OcurrenceController