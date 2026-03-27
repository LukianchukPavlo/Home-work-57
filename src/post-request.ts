import http from 'node:http';
import querystring from 'node:querystring';

export default function handlePost(request: http.IncomingMessage, response: http.ServerResponse) {
    const { method, url, headers } = request;

    if (method !== "POST" || url !== "/submit") {
        const html = "<h1>Not Found</h1>";

        response.statusCode = 404;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.setHeader("Content-Length", Buffer.byteLength(html));
        response.setHeader("X-Content-Type-Options", "nosniff");

        response.end(html);
        return;
    }

    if (!headers['content-type']?.includes('application/x-www-form-urlencoded')) {
        const html = "<h1>Unsupported Media Type</h1>";

        response.statusCode = 415;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.setHeader("Content-Length", Buffer.byteLength(html));
        response.setHeader("X-Content-Type-Options", "nosniff");

        response.end(html);
        return;
    }

    let body = "";

    request.on("data", chunk => {
        body += chunk.toString();

        if (body.length > 1e6) {
            request.destroy();

            const html = "<h1>Payload Too Large</h1>";

            response.statusCode = 413;
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            response.setHeader("Content-Length", Buffer.byteLength(html));
            response.setHeader("X-Content-Type-Options", "nosniff");

            response.end(html);
            return;
        }
    });

    request.on("end", () => {
        const parsedData = querystring.parse(body);

        const name = String(parsedData.name || "").trim();
        const email = String(parsedData.email || "").trim();

        if (!name || !email) {
            const html = "<h1>Invalid form data</h1>";

            response.statusCode = 400;
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            response.setHeader("Content-Length", Buffer.byteLength(html));
            response.setHeader("X-Content-Type-Options", "nosniff");

            response.end(html);
            return;
        }

        const safeName = name.replace(/</g, "&lt;");
        const safeEmail = email.replace(/</g, "&lt;");

        const html = `
            <h1>Form Submitted</h1>
            <p>Name: ${safeName}</p>
            <p>Email: ${safeEmail}</p>
        `;

        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.setHeader("Content-Length", Buffer.byteLength(html));
        response.setHeader("X-Content-Type-Options", "nosniff");

        response.end(html);
    });

    request.on("error", () => {
        const html = "<h1>Server Error</h1>";

        response.statusCode = 500;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.setHeader("Content-Length", Buffer.byteLength(html));
        response.setHeader("X-Content-Type-Options", "nosniff");

        response.end(html);
    });
}





