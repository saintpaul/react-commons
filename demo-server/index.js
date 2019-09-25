const Hapi = require('@hapi/hapi');


function getRandomInt(min = 0 , max = 100) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

const validate = async (request, username, password, h) => {
    console.log("validate")
};


const init = async () => {

    const server = Hapi.server({
        port: 8112,
        host: 'localhost'
    });

    await server.register(require('@hapi/basic'));
    server.auth.strategy('simple', 'basic', { validate });

    server.route({
        method: 'GET',
        path: '/pokemon/{name}',
        handler: function (request, h) {
            var name = encodeURIComponent(request.params.name);
            var power = getRandomInt();
            return h.response({name, power});
        }
    });

    server.route({
        method: 'GET',
        path: '/internal-server-error',
        handler: function (request, h) {
            return h.response({}).code(500);
        }
    });

    server.route({
        method: 'GET',
        path: '/bad-request',
        handler: function (request, h) {
            return h.response({}).code(400);
        }
    });

    server.route({
        method: 'GET',
        path: '/bad-request/with-message',
        handler: function (request, h) {
            var error = "You're a wicked developer !";
            return h.response({error}).code(400);
        }
    });

    server.route({
        method: 'GET',
        path: '/unauthorized',
        handler: function (request, h) {
            return h.response({}).code(401);
        }
    });

    server.route({
        method: 'GET',
        path: '/empty-response',
        handler: function (request, h) {
            return h.response().code(200);
        }
    });

    server.route({
        method: 'POST',
        path: '/upload',
        config: {

            payload: {
                output: 'stream',
                maxBytes: 1000 * 1000 * 10
            },
        },
        handler: function (request, h) {
            return h.response({});
        }
    });

    server.route({
        method: 'GET',
        path: '/timeout',
        handler: function (request, h) {
            setTimeout(() => {
                return h.response({ message: "success"}).code(200);
            }, 5 * 1000);
        }
    });

    server.route({
        method: 'POST',
        path: '/basicAuth',
        config: {
            auth: "simple",
        },
        handler: function (request, h) {
            return "ok";
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();