import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Octokit } from "octokit";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // GitHub Upload API
  app.post("/api/github-upload", async (req, res) => {
    const { token, owner, repo, branch } = req.body;
    if (!token || !owner || !repo || !branch) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    try {
      const { Octokit } = await import("octokit");
      const { readdir, readFile } = await import("fs/promises");
      const octokit = new Octokit({ auth: token });
      
      const getFiles = async (dir: string): Promise<string[]> => {
        const dirents = await readdir(dir, { withFileTypes: true });
        const files = await Promise.all(dirents.map((dirent) => {
          const res = path.resolve(dir, dirent.name);
          return dirent.isDirectory() ? getFiles(res) : res;
        }));
        return files.flat();
      };

      const allFiles = await getFiles(process.cwd());
      const filteredFiles = allFiles.filter(f => !f.includes('node_modules') && !f.includes('.git') && !f.includes('dist'));

      for (const file of filteredFiles) {
        const contentBuffer = await readFile(file);
        const relativePath = path.relative(process.cwd(), file);
        
        try {
          await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner,
            repo,
            path: relativePath,
            message: `chore: upload ${relativePath}`,
            content: contentBuffer.toString('base64'),
            branch,
          });
          console.log(`Uploaded ${relativePath}`);
        } catch (e: any) {
           console.error(`Failed to upload ${relativePath}: ${e.message}`);
        }
      }
      
      res.json({ status: "success" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to upload to GitHub" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
