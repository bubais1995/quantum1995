# CloudPanel Website Setup Commands

## Complete Setup Guide for Running on CloudPanel with Putty

---

## 1. INITIAL SETUP (Run Once)

### Step 1: Navigate to Your Project Directory
```bash
cd /home/{your_username}/htdocs/quantum1995
```
Replace `{your_username}` with your actual CloudPanel username.

---

### Step 2: Install Dependencies
```bash
npm install
```
This installs all required packages (React, Next.js, MySQL, etc.)
**Time:** 2-5 minutes

---

### Step 3: Setup Database

#### First, ensure MySQL package is installed:
```bash
npm install mysql2
```

#### Run database migration:
```bash
npm run db:migrate
```
Expected output:
```
✅ Connected to database
✅ Found 47 SQL statements
🚀 Executing SQL statements...
✅ Migration completed successfully!
```

#### Test database connection:
```bash
npm run db:test
```
Expected output:
```
✅ Connection successful!
✅ Tables found: 14
✅ All tests passed!
```

---

## 2. DEVELOPMENT MODE (Testing/Debugging)

### Start Development Server
```bash
npm run dev
```

**What happens:**
- Server starts on port 3003
- Access at: `http://localhost:3003` (or your CloudPanel domain)
- Hot reload enabled (changes auto-refresh)
- Shows terminal logs for debugging

**To stop:** Press `CTRL+C` in terminal

**Keep running in background:**
```bash
npm run dev &
```

---

## 3. PRODUCTION MODE (For Live Website)

### Step 1: Build the Website
```bash
npm run build
```
**Time:** 2-5 minutes
**Output:** Optimized production build in `.next/` folder

### Step 2: Start Production Server
```bash
npm start
```

**What happens:**
- Server starts on port 3000
- Optimized for performance
- Designed for continuous running

**Keep running in background:**
```bash
npm start &
```

---

## 4. USEFUL COMMANDS WHILE RUNNING

### Check TypeScript Errors (Before Running)
```bash
npm run typecheck
```

### Run Linting
```bash
npm run lint
```

### Stop Running Server
```bash
CTRL+C
```
(Press Ctrl and C at same time)

### Check if Server is Running
```bash
ps aux | grep node
```

### Kill Background Process
```bash
pkill -f "node"
```
or
```bash
kill -9 {process_id}
```

---

## 5. COMPLETE WORKFLOW (Ready to Go)

### Fresh Start:
```bash
# Navigate to project
cd /home/{your_username}/htdocs/quantum1995

# Install all packages
npm install

# Setup database (first time only)
npm run db:migrate
npm run db:test

# Start development server
npm run dev
```

### Access Website:
- **Local:** `http://localhost:3003`
- **From web:** `http://www.quantumalphaindia.com`

---

## 6. IMPORTANT PORTS

| Port | Purpose | Usage |
|------|---------|-------|
| 3003 | Development | `npm run dev` |
| 3000 | Production | `npm start` |
| 3306 | MySQL Database | Backend connection |

---

## 7. QUICK REFERENCE CHEAT SHEET

```bash
# Setup (first time)
npm install
npm run db:migrate
npm run db:test

# Development
npm run dev              # Start dev server (port 3003)
npm run typecheck        # Check TypeScript errors
npm run lint             # Run code linting

# Production
npm run build            # Build optimized version
npm start                # Start production server (port 3000)

# Database
npm run db:migrate       # Create all tables
npm run db:test          # Test connection
npm run db:backup        # Backup database

# Utilities
ps aux | grep node       # Check running processes
pkill -f "node"          # Stop all node processes
CTRL+C                   # Stop current process
ps aux | grep npm        # Check npm processes
```

---

## 8. TROUBLESHOOTING

### Port Already in Use
```bash
# Kill existing process on port 3000/3003
lsof -i :3000
kill -9 {PID}
```

### Clear Cache
```bash
rm -rf .next
npm run build
npm start
```

### Reinstall All Packages
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Error
```bash
npm run db:test
# Check credentials in .env.local
cat .env.local | grep DB_
```

### Cannot Find npm
```bash
# Check Node.js installation
node --version
npm --version

# Install if needed (CloudPanel should have it)
# Contact CloudPanel support if missing
```

---

## 9. PRODUCTION DEPLOYMENT FULL SEQUENCE

### All Commands in Order:
```bash
# 1. Navigate to project
cd /home/{your_username}/htdocs/quantum1995

# 2. Pull latest code (if using Git)
git pull origin main

# 3. Install dependencies
npm install

# 4. Type check
npm run typecheck

# 5. Build for production
npm run build

# 6. Start server
npm start

# To keep running after closing terminal, use:
nohup npm start > server.log 2>&1 &
```

---

## 10. MONITORING IN PRODUCTION

### View Server Logs
```bash
# If started with nohup
tail -f server.log

# If running in terminal
# (logs display directly)

# Check last 50 lines
tail -50 server.log
```

### Monitor Resource Usage
```bash
# Check CPU and memory
top

# Check disk space
df -h

# Check specific process
ps aux | grep node
```

---

## 11. RESTART SERVER

### Stop Current Server
```bash
# Press CTRL+C in the terminal running the server

# OR kill the process
pkill -f "npm start"
pkill -f "npm run dev"
```

### Start Again
```bash
npm start        # Production
# or
npm run dev      # Development
```

---

## 12. DATABASE COMMANDS

### Backup Database
```bash
mysqldump -h 127.0.0.1 -u quantumalphaindiadb -p quantumalphaindiadb > backup_$(date +%Y%m%d_%H%M%S).sql
# Password: quantumalphaindia@2026
```

### Access MySQL Directly
```bash
mysql -h 127.0.0.1 -u quantumalphaindiadb -p
# Password: quantumalphaindia@2026

# Common commands:
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM followers;
SELECT * FROM copy_trades LIMIT 10;
EXIT;
```

### Reset Database
```bash
mysql -h 127.0.0.1 -u quantumalphaindiadb -p
DROP DATABASE quantumalphaindiadb;
CREATE DATABASE quantumalphaindiadb;
EXIT;
npm run db:migrate
```

---

## 13. ENVIRONMENT FILE (.env.local)

Location: `/home/{your_username}/htdocs/quantum1995/.env.local`

Already configured with:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=quantumalphaindiadb
DB_PASSWORD=quantumalphaindia@2026
DB_NAME=quantumalphaindiadb
```

If you need to edit:
```bash
nano .env.local
# Edit the file
# Press CTRL+X, then Y, then ENTER to save
```

---

## 14. COMMON SCENARIOS

### Scenario 1: First Time Running Website
```bash
cd /home/{your_username}/htdocs/quantum1995
npm install
npm run db:migrate
npm run db:test
npm start
```
Then visit: `http://www.quantumalphaindia.com`

### Scenario 2: Make Code Changes and Test
```bash
# Terminal is already running npm run dev
# Make changes to code files
# Website auto-refreshes (no restart needed)

# When satisfied, stop and build for production
# Press CTRL+C to stop dev server
npm run build
npm start
```

### Scenario 3: Website Stopped, Need to Restart
```bash
ps aux | grep node          # Check if running
npm start                   # If not running, start it
```

### Scenario 4: Deploy New Code
```bash
cd /home/{your_username}/htdocs/quantum1995
git pull origin main         # Get latest code
npm install                  # Install any new packages
npm run build
npm start
```

### Scenario 5: Fix Database Issues
```bash
npm run db:test              # Check connection
# If errors, recreate:
mysql -h 127.0.0.1 -u quantumalphaindiadb -p
DROP DATABASE quantumalphaindiadb;
CREATE DATABASE quantumalphaindiadb;
EXIT;
npm run db:migrate
npm run db:test
npm start
```

---

## 15. SSH/PUTTY CONNECTION TIPS

### Connect to CloudPanel
1. Open Putty
2. Enter CloudPanel host/IP in "Host Name"
3. Port: 22
4. Click "Open"
5. Login with your CloudPanel credentials

### File Transfer (WinSCP)
- Transfer files to/from CloudPanel
- Navigate to `/home/{your_username}/htdocs/quantum1995/`
- Edit files locally and upload

### Keep Process Running After Disconnect
```bash
# Use nohup to keep running after logout
cd /home/{your_username}/htdocs/quantum1995
nohup npm start > server.log 2>&1 &

# Type 'exit' to logout - server keeps running
exit
```

### Login Back and Check Status
```bash
# Reconnect with Putty
ps aux | grep node           # Check if running
tail -f server.log           # View logs

# To stop:
pkill -f "npm start"
```

---

## 16. FINAL CHECKLIST

Before going live:

- [ ] Navigated to project directory: `cd /home/.../quantum1995`
- [ ] Dependencies installed: `npm install`
- [ ] Database migrated: `npm run db:migrate`
- [ ] Database tested: `npm run db:test`
- [ ] No TypeScript errors: `npm run typecheck`
- [ ] Build successful: `npm run build`
- [ ] Server starts: `npm start`
- [ ] Website accessible at domain
- [ ] Login page working
- [ ] OAuth connection testing
- [ ] Follower registration working
- [ ] Copy trades displaying

---

## 17. SUPPORT

**Issue:** Port already in use
**Fix:** `lsof -i :3000` then `kill -9 PID`

**Issue:** npm not found
**Fix:** Check with `node --version` and `npm --version`

**Issue:** Database connection error
**Fix:** `npm run db:test` and verify `.env.local`

**Issue:** Website won't start
**Fix:** `npm run typecheck` to find errors

**Issue:** Out of memory
**Fix:** `npm run build` takes less resources than `npm run dev`

---

## 18. QUICK COPY-PASTE COMMANDS

### Just Getting Started? Copy These:
```bash
cd /home/{your_username}/htdocs/quantum1995 && npm install && npm run db:migrate && npm run db:test && npm start
```

### Start Development:
```bash
cd /home/{your_username}/htdocs/quantum1995 && npm run dev
```

### Build & Start Production:
```bash
cd /home/{your_username}/htdocs/quantum1995 && npm run build && npm start
```

### Keep Running After Logout:
```bash
cd /home/{your_username}/htdocs/quantum1995 && nohup npm start > server.log 2>&1 &
```

---

**All commands ready to copy/paste into Putty terminal!**

