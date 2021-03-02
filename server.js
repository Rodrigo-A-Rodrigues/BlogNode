const mongoose = require('mongoose')

require('dotenv').config({path:'variables.env'})

// Connection DATABASE
mongoose.connect(process.env.DATABASE, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (error) =>{
    console.error("ERRO: "+error.message);
});

//Carregando Models
require('./models/Post');

const app = require('./app');
app.set('port', process.env.PORT || 3333);
const server = app.listen(app.get('port'), () =>{
    console.log("Servidor rodando na porta: "+server.address().port);
});