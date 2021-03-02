const mongoose = require('mongoose');
const slug = require('slug');

mongoose.Promise = global.Promise;

const postShema = new mongoose.Schema({
    photo:String,
    title: {
        type: String,
        trim: true, //Retira espaços desnecessários
        required: 'Necessita de Título',
    },
    description: {
        type: String,
        trim: true,
    },
    slug: String,
    body: {
        type: String,
        trim: true,
        required: 'Escreva seu artigo'
    },
    tags:[String]
});

postShema.pre('save', async function(next) {
    if(this.isModified('title')){
        this.slug = slug(this.title, {lower:true});

        // Mudando o slug de mesmo nome
        const slugRegex = new RegExp(`^(${this.slug})((-[0-9]{1,})?)$`, 'i');
        const postsWithSlug = await this.constructor.find({slug:slugRegex});

        if(postsWithSlug.length > 0) {
            this.slug = `${this.slug}-${postsWithSlug.length + 1}`;
        }
    }

    next();
})

postShema.statics.getTagsList = function() {
    return this.aggregate([
        { $unwind:'$tags' }
    ]);
}

module.exports = mongoose.model('Post', postShema);