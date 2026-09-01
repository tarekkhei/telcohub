# Git → Replit (Coreveo / TelcoAgentic)

GitHub is already done. This is **GitHub → Replit import → run → Static publish**.

This app is a Vite + React SPA with mock data in `src/data` (no database, no backend, no live LLM). On Replit **Core**, Static hosting is free; transfer is billed against included credits.

---

## 1. Import the GitHub repo

1. Sign in at [replit.com](https://replit.com) on the Core account.
2. Open [replit.com/import](https://replit.com/import).
3. Choose **GitHub**.
4. Connect GitHub if prompted (grant org access if the repo is under an org).
5. Select the Coreveo / TelcoAgentic repo.
6. Click **Import**.

**Do not** let Agent “rebuild” or “migrate” the app. That burns Core credits. Import the existing code as-is.

Shortcut for a **public** repo: open

```
https://replit.com/github.com/<org-or-user>/<repo-name>
```

Example: GitHub `https://github.com/exampleUser/my-app` → Replit `https://replit.com/github.com/exampleUser/my-app`

---

## 2. Set the Run command (preview in Replit)

After import, open the Replit App.

1. Open **Tools → Workflows** (or the **Run** config).
2. Set **Run** to:

```bash
npm install && npm run dev -- --host 0.0.0.0 --port 5000
```

`--host 0.0.0.0` is required so Replit’s preview can reach Vite. Default `localhost` will look like the app is down.

3. Click **Run**.
4. Open the **Webview**. You should see Command Center.

No secrets to add. No database to attach.

---

## 3. Confirm the demo path

In the Replit preview:

1. Command Center shows the exception counts.
2. Open `EXC-2026-0146`.
3. Click through diagnosis → **Approve & Execute** → **VERIFIED**.

If that works, the import is good.

---

## 4. Publish as Static (this is the live URL)

1. Click **Publish** at the top.
2. Open **Adjust settings**.
3. Set **Deployment type** to **Static** (not Autoscale, not Reserved VM).
4. Set:

   - **Build command:** `npm run build`
   - **Public directory:** `dist`

5. Add a SPA rewrite so React Router deep links work (refresh on `/exceptions/...` must not 404). In `.replit`:

```toml
[deployment]
build = ["npm", "run", "build"]
deploymentTarget = "static"
publicDir = "dist"

[[deployment.rewrites]]
from = "/*"
to = "/index.html"
```

6. Click **Publish**.
7. Copy the `*.replit.app` URL.

First publish usually takes under a minute. Hosting is free on Static; transfer comes out of Core credits.

---

## 5. Share and keep it updated

| Action | What to do |
|---|---|
| Share | Send the `*.replit.app` URL. |
| Code change in GitHub | In Replit: **Git → Pull**, then **Publish** again. Replit does not auto-redeploy from GitHub. |
| Later GitHub pushes | Repeat Pull → Publish. |

---

## If something fails

| Symptom | Fix |
|---|---|
| Import shows no repos | Disconnect/reconnect GitHub under **Account → Git Providers**. For org repos, approve the Replit OAuth app. |
| Preview blank / connection refused | Run with `--host 0.0.0.0`. |
| Live site 404 on a detail page | Missing `deployment.rewrites` to `/index.html`. |
| Agent started rewriting files | Stop it. Re-import and skip Agent. |

---

## Cost (Core plan already paid)

Deploying this app adds essentially **$0**.

- Static hosting is free.
- Outbound transfer is **$0.05/GiB**, covered by Core’s monthly credits.
- No Replit DB, App Storage, or reserved VM.

Use **Static**. Autoscale and Reserved VM are unnecessary for this mockup.
