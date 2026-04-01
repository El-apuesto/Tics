# Free Uptime Monitoring Services

## Option 1: Uptime Robot (Recommended)
1. Go to https://uptimerobot.com
2. Sign up for free account
3. Create HTTP Monitor
4. URL: https://your-backend-url.onrender.com/api/shows
5. Interval: 5 minutes
6. Alert: None (or email if you want notifications)

## Option 2: Pingdom
1. Go to https://pingdom.com
2. Free tier: 1 uptime check
3. Monitor: /api/shows endpoint
4. Interval: 5 minutes

## Option 3: StatusCake
1. Go to https://statuscake.com
2. Free tier: Multiple checks
3. Monitor your API endpoint
4. Set 5-minute intervals

## Option 4: GitHub Actions (Advanced)
Create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Backend Alive

on:
  schedule:
    - cron: '*/10 * * * *'  # Every 10 minutes

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - name: Ping backend
        run: curl https://your-backend-url.onrender.com/api/shows
```

## How This Works:
- External service pings your API every 5-10 minutes
- Prevents 15-minute inactivity timeout
- Backend stays "warm" and responsive
- Completely free solution
```
