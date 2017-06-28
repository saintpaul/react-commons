var fs = require('fs');
var Hapi = require('hapi');


function getRandomInt(min = 0 , max = 100) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


var server = new Hapi.Server();

server.connection({ port: 8112, host: 'localhost'});


server.route({
    method: 'GET',
    path: '/pokemon/{name}',
    handler: function (request, reply) {
        setTimeout(() => {
            var name = encodeURIComponent(request.params.name);
            var power = getRandomInt();
            reply({name, power});
        }, 500);
    }
});

server.route({
    method: 'GET',
    path: '/internal-server-error',
    handler: function (request, reply) {
        return reply({}).code(500);
    }
});

server.route({
    method: 'GET',
    path: '/bad-request',
    handler: function (request, reply) {
        return reply({}).code(400);
    }
});

server.route({
    method: 'GET',
    path: '/bad-request/with-message',
    handler: function (request, reply) {
        var error = "You're a wicked developer !";
        return reply({error}).code(400);
    }
});

server.route({
    method: 'GET',
    path: '/unauthorized',
    handler: function (request, reply) {
        return reply({}).code(401);
    }
});

server.route({
    method: 'GET',
    path: '/empty-response',
    handler: function (request, reply) {
        return reply().code(200);
    }
});

server.route({
    method: 'POST',
    path: '/upload',
    config: {

        payload: {
            output: 'stream',
            parse: true
        },
    },
    handler: function (request, reply) {
        reply({});
    }
});

server.start(function () {
    console.log('info', 'Server running at: ' + server.info.uri);
});