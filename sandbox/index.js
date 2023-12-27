/**
 * Simple node http server to serve all files in the current directory
 * And all files in ../mod/minigames
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 8080;

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url);

  // If path is mod/ something, then we need to go up one directory
  if (req.url.startsWith("/mod/")) {
    filePath = path.join(__dirname, "..", req.url);
  }

  const extname = path.extname(filePath);
  const contentType = getContentType(extname);
  const isFile = fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();

  console.log("Request", req.url, filePath, isFile);

  if (isFile) {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data, "utf-8");
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  // Start browser
  const { exec } = require("child_process");
  exec(`start http://localhost:${port}/woodcutting/index.html`);
});

function getContentType(extname) {
  switch (extname) {
    case ".js":
    case ".mjs":
      return "text/javascript";
    case ".css":
      return "text/css";
    case ".html":
      return "text/html";
    case ".json":
      return "application/json";
    default:
      return "text/plain";
  }
}
