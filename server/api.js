// Criando API
// meteor create --full api

if (Meteor.isServer) {

    var Api = new Restivus({ // instalar meteor add nimble:restivus
        useDefaultAuth: false,
        prettyJson: true
    });
 
    // Get, Post, Put, Delete

    Api.addRoute('users/:email', { authRequire: false }, {

        delete: function () {

            var user = Meteor.users.findOne({ //busca no bd da conta
                'emails.address': this.urlParams.email //pegando o email do parametro
            });

            if (user) { //se encontrar o usuario
                Meteor.users.remove(user._id); //remove o usuario

                return {
                    message: 'Usuario removido com sucesso!'
                }
            } else {
                return {
                    statusCode: 404,
                    body: { message: 'Usuario não localizado!' }
                }
            }
        },

        get: function(){
            var user = Meteor.users.findOne({ //busca no bd da conta
                'emails.address': this.urlParams.email //pegando o email do parametro
            });
            console.log(user);

            // return{
            //     statusCode:200,
            //     body:
            //     {
            //         profile: { name: user.name },    
            //         email: user.email,
            //         password: user.password        
            //     }
            // }
        }
    })

    Api.addRoute('users', { authRequire: false }, {

        get: function () {
            return {
                statusCode: 200,
                body: { message: 'API no ar :)' }
            }
        },

        post: function () {

            var Future = require('fibers/future');
            var future = new Future();

            var body = this.request.body; //pega o corpo da requisit
            var response;
  
            var user = {
                email: body.email,
                password: body.password,
                profile: { name: body.name }
            }
            
            Meteor.call('saveAccount', user, function (err, res) {
                if (err) {
                    if (err.reason = 'Email already exists.'){
                        future.return({
                            statusCode: 404,
                            body: { message: 'Você está cadastrado.' }
                        })    
                    }else{
                        future.return({
                            statusCode: 404,
                            body: { message: err.reason }
                        })
                    }
                } else {
                    console.log('tudo certo aqui.')
                    future.return({
                        statusCode: 200,
                        body: { message: 'Usuario inserido com sucesso!' }
                    });
                }
            })
            return future.wait(response); //retorne quando o response tiver valor
        }
    })
}