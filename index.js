const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

//define server
var server = http.createServer(function (req, res) {
    console.log('got a request...');

    //parse url
    const parsedUrl = url.parse(req.url, true);

    //get path
    const path = parsedUrl.path;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    console.log('path', path, 'trimmedPath', trimmedPath);

    //get query string object
    const QueryString = parsedUrl.query;

    //get headers
    const headers = req.headers;

    //get method
    const method = req.method;

    const decoder = new StringDecoder('utf8');
    var buffer = '';

    //parse request
    req.on('data', chunk => {
        buffer += decoder.write(chunk);
    });
    req.on('end', () => {
        buffer += decoder.end();
        
        console.log('A chunk of data has arrived: ', buffer);

        var chosenHandler = typeof( handlers[trimmedPath] ) !== 'undefined'? handlers[trimmedPath]: handlers.notfound;

        var data = {
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        chosenHandler(data, function(statusCode, payload) {
            console.log('in chosenHandler...', payload);

            payload = typeof( payload ) == 'object'? payload: {};

            res.writeHead(statusCode);
            res.end(JSON.stringify( payload ));
        })
    });
}).listen(8080);

//define handlers
var handlers = {
    "hello": function(data, callback) {
        console.log('in hello handler', data);
        
        //callback(200, data);
        callback(200, {"greeting": "Hello World!..."} ); //overriding payload for customized message
    },

    "notfound": function(data, callback) {
        callback(404);
    }
};

//define router, not required as handler json can be directly used
/*var router = {
    "hello": handlers.hello
};*/