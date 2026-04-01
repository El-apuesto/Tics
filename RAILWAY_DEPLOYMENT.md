# Railway Full Stack Deployment

## Deploy Both Frontend and Backend on Railway

### Step 1: Project Structure
```
your-repo/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
├── src/
├── package.json
├── vite.config.ts
└── railway.toml
```

### Step 2: Railway Configuration
Create `railway.toml` in root:

```toml
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/api/shows"
healthcheckTimeout = 100
restartPolicyType = "on_failure"

[[services]]
name = "app"

[services.variables]
NODE_ENV = "production"
PORT = "3001"

[[services]]
name = "frontend"
source = "."
```

### Step 3: Update Frontend API URL
```typescript
// src/lib/api-config.ts
export const API_BASE = `${window.location.origin}/api`;
```

### Step 4: Deploy
1. Go to railway.app
2. Connect GitHub repo
3. Railway auto-detects both services
4. Set environment variables
5. Deploy both services

### Cost: $5/month after free credits
### Benefit: Everything in one place
```
