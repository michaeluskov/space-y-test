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
const authCookie = 'auth';

function check(request, response, next) {
  const user = request.cookies[authCookie];
  if (!user && !(request.path.startsWith("/static") || request.path.startsWith("/api") || request.path === "/login" || request.path.endsWith(".mjs"))) {
    response.redirect("/login");
  } else
  next();
}

app.get("/client.mjs", (_, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.sendFile(path.join(rootDir, "client.mjs"), {
    maxAge: -1,
    cacheControl: false,
  });
});

app.use(cookieParser({}));
app.use(bodyParser.json());
app.use(check);
app.use(express.static('spa/build'));

app.get("/api/user", (req, res) => {
  res.json({
    username: req.cookies['username']
  });
  console.log(req.cookies['username']);
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

// app.get("/api/user", (req, res) => {
//   let user = req.cookies[authCookie];
//   res.json({user: user || null});
// });
//
// app.post("/api/user", (req, res) => {
//   let { user } = req.body;
//   res.cookie(authCookie, user, {httpOnly: true, secure: true, sameSite: "strict"});
//   res.json({user: user || null});
// });
//
// app.delete("/api/user", (req, res) => {
//   res.clearCookie(authCookie);
//   res.sendStatus(200);
// });


// https.createServer({
//   key: fs.readFileSync(path.join(rootDir, "/certs/server.key")),
//   cert: fs.readFileSync(path.join(rootDir, "/certs/server.cert"))
// }, app)
//     .listen(port, () => {
//       console.log(`App listening on port ${port}`);
//     });
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});