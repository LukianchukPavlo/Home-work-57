import http from 'node:http';
import handleGet from './get-request.js';
import handlePost from './post-request.js';

const PORT = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
    try {
        if (request.method === "GET") {
            return handleGet(request, response);
        }

        if (request.method === "POST") {
            return handlePost(request, response);
        }

        const html = "<h1>Not Found</h1>";

        response.statusCode = 404;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.setHeader("Content-Length", Buffer.byteLength(html));
        response.setHeader("X-Content-Type-Options", "nosniff");

        response.end(html);
    } catch (error) {
        const html = "<h1>Server Error</h1>";

        response.statusCode = 500;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.setHeader("Content-Length", Buffer.byteLength(html));
        response.setHeader("X-Content-Type-Options", "nosniff");

        response.end(html);
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});