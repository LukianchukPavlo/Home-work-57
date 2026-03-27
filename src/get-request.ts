import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

function sendHtml(response: http.ServerResponse, filePath: string) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            const html = "<h1>Server Error</h1>";

            response.statusCode = 500;
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            response.setHeader("Content-Length", Buffer.byteLength(html));
            response.setHeader("X-Content-Type-Options", "nosniff");

            response.end(html);
            return;
        }

        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.setHeader("Content-Length", data.length);
        response.setHeader("X-Content-Type-Options", "nosniff");

        response.statusCode = 200;
        response.end(data);
    });
}

export default function handleGet(request: http.IncomingMessage, response: http.ServerResponse) {

    if (request.url === "/") {
        const filePath = path.join(process.cwd(), "src", "http", "home.html");
        return sendHtml(response, filePath);
    }

    if (request.url === "/about") {
        const filePath = path.join(process.cwd(), "src", "http", "about.html");
        return sendHtml(response, filePath);
    }

    if (request.url === "/contact") {
        const filePath = path.join(process.cwd(), "src", "http", "contact.html");
        return sendHtml(response, filePath);
    }

    const html = "<h1>Page Not Found</h1>";

    response.statusCode = 404;
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.setHeader("Content-Length", Buffer.byteLength(html));
    response.setHeader("X-Content-Type-Options", "nosniff");

    response.end(html);
}
