'use strict'

const mongoose = require("mongoose");
const app = require("./app");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://hugos:kinal2017252@ds253567.mlab.com:53567/heroku_6j5hjpjw', { useNewUrlParser: true }).then(()=>{
    console.log('Se encuentra conectado a la Base de Datos');

    app.set('port', process.env.PORT || 3000 );
    app.listen(app.get('port'), ()=>{
        console.log(`El servidor esta corriendo en el puerto: '${app.get('port')}'`);
    });
}).catch(err => console.log(err));