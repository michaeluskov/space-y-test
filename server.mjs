import * as path from "path";
import fs from "fs";
import express from "express";
import https from "https";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use(express.static('spa/build'))

app.get("/client.mjs", (_, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.sendFile(path.join(rootDir, "client.mjs"), {
    maxAge: -1,
    cacheControl: false,
  });
});

app.get("/api/user", (req, res) => {
  res.json({
    username: null
  });
  console.log(req.cookie['username']);
});

app.post("/api/user", (req, res) => {
  const name = req.body.user;
  console.log(name);
  res.cookie('username', name, {secure:true, httpOnly: true, sameSite: "strict"});
  res.json({username: name})
});

app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'spa/build/index.html'))
})

// require("https")
//   .createServer(
//     {
//       key: readFileSync("/certs/server.key"),
//       cert: readFileSync("/certs/server.cert"),
//     },
//     app
//   )
//   .listen(port, function () {
//     console.log(`App listening on port ${port}`);
//   });

app.listen(port, function () {
  console.log(`App listening on port ${port}`);
});