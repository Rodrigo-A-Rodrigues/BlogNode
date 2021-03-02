const mongoose = require('mongoose');
const slug = require('slug');
const Post = mongoose.model('Post');

exports.add = (req, res) =>{
    res.render('postAdd');
};

exports.addAction = async (req,res) =>{
    req.body.tags = req.body.tags.split(',').map(t=>t.trim());
    const post = new Post(req.body);

    try{
        await post.save();
    } catch(error){
        req.flash('error', 'Erro: '+error.message);
        return res.redirect('/post/add');       
    }

    req.flash('sucess', 'Post realizado com sucesso!');
    res.redirect('/');
};

exports.edit = async (req,res) =>{
    // 1. Pegar informações
    const post = await Post.findOne({ slug:req.params.slug });
    // 2. Carregar formulário de edição
    res.render('postEdit', { post });
}

exports.editAction = async (req,res) =>{
    req.body.slug = slug(req.body.title, {lower:true});
    req.body.tags = req.body.tags.split(',').map(t=>t.trim());
    
    try{
        // Procurar o item enviado
        const post = await Post.findOneAndUpdate(
            { slug:req.params.slug }, 
            req.body, 
            { 
                new:true, // Retorna o post atualizado
                runValidators:true 
            }
        );
    } catch(error) {
        req.flash('error', 'Erro: '+error.message);
        return res.redirect('/post/'+req.params.slug+'/edit');
    }
    // Pegar os dados e atualizar
    // Mostrar mensagem
    // Redirecionar
    req.flash('sucess', 'post atualizado');

    res.redirect('/');    
}

exports.view = async (req,res) =>{
    // 1. Pegar informações
    const post = await Post.findOne({ slug:req.params.slug });
    // 2. Carregar formulário de edição
    res.render('view', { post });
}