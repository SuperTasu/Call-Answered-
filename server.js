// 必要: npm install express multer node-fetch

const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");

const upload = multer({ storage: multer.memoryStorage() });
const app = express();

// ★ GitHub 情報（サーバー側にのみ置く）
const TOKEN = process.env.GITHUB_TOKEN;   // GitHub Personal Access Token
const OWNER = "あなたのGitHubユーザ名";
const REPO  = "あなたのリポジトリ名";

app.use(express.static("public")); // index.html を public に置く

app.post("/upload-to-github", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const savePath = req.body.path;

    const contentBase64 = file.buffer.toString("base64");

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${savePath}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `token ${TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json"
      },
      body: JSON.stringify({
        message: "Upload from embedded site",
        content: contentBase64
      })
    });

    const json = await response.json();
    res.json(json);

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
