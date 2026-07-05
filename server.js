const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const PUBLIC_DIR = path.resolve(__dirname);

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
    // Strip query parameters
    const urlPath = req.url.split('?')[0];
    let filePath = path.join(PUBLIC_DIR, urlPath === '/' ? 'index.html' : urlPath);
    
    // Safety check to prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
    }
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.end('Not Found');
            } else {
                res.statusCode = 500;
                res.end('Internal Server Error: ' + err.code);
            }
            return;
        }
        
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
