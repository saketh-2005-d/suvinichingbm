# 🚀 Deployment Guide - Diet Planner Pro

## Table of Contents

1. [Local Development](#local-development)
2. [Production Deployment](#production-deployment)
3. [Environment Setup](#environment-setup)
4. [Troubleshooting](#troubleshooting)

---

## Local Development

### Prerequisites

- Python 3.8 or higher
- Node.js 14+ (optional, for frontend development)
- OpenAI API Key

### Quick Setup (Windows)

```batch
# 1. Clone or navigate to the project
cd Diet planner

# 2. Set up backend
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt

# 3. Configure environment variables
copy .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### Quick Setup (Mac/Linux)

```bash
# 1. Navigate to the project
cd Diet\ planner

# 2. Set up backend
cd backend
python3 -m pip install --upgrade pip
pip install -r requirements.txt

# 3. Configure environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### Running Locally

**Start the Backend Server:**

```bash
cd backend
python app.py
```

You should see:

```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

**Serve the Frontend:**

Open `frontend/index.html` in your browser or run a local server:

```bash
# Using Python 3
python -m http.server 8000 --directory frontend

# Using Python 2
python -m SimpleHTTPServer 8000
```

Then navigate to `http://localhost:8000`

---

## Production Deployment

### Option 1: Deploy with Heroku (Recommended)

#### Prerequisites

- Heroku CLI installed
- Git repository initialized
- Heroku account

#### Steps

1. **Create Heroku App:**

   ```bash
   heroku create your-app-name
   ```

2. **Set Environment Variables:**

   ```bash
   heroku config:set OPENAI_API_KEY=your_actual_key_here
   ```

3. **Create Procfile in root directory:**

   ```
   web: cd backend && pip install -r requirements.txt && gunicorn app:app
   ```

4. **Create requirements.txt in root** (copy from backend and add):

   ```
   gunicorn==20.1.0
   ```

5. **Deploy:**

   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **Update frontend API URL** in `script.js`:
   ```javascript
   const API_BASE_URL = "https://your-app-name.herokuapp.com/api";
   ```

### Option 2: Deploy with AWS EC2

#### Prerequisites

- AWS Account
- EC2 instance (Ubuntu 20.04 recommended)
- SSH access to instance

#### Steps

1. **SSH into your instance:**

   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

2. **Update system and install dependencies:**

   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install python3-pip python3-venv git nginx -y
   ```

3. **Clone your repository:**

   ```bash
   git clone your-repo-url /home/ubuntu/diet-planner
   cd /home/ubuntu/diet-planner
   ```

4. **Set up Python virtual environment:**

   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install gunicorn
   ```

5. **Create .env file:**

   ```bash
   echo "OPENAI_API_KEY=your_actual_key_here" > .env
   ```

6. **Create systemd service file:**

   ```bash
   sudo nano /etc/systemd/system/diet-planner.service
   ```

   Add:

   ```ini
   [Unit]
   Description=Diet Planner Flask App
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/diet-planner/backend
   ExecStart=/home/ubuntu/diet-planner/backend/venv/bin/gunicorn -b 127.0.0.1:5000 app:app
   Restart=always
   Environment="OPENAI_API_KEY=your_key"

   [Install]
   WantedBy=multi-user.target
   ```

7. **Enable and start service:**

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable diet-planner
   sudo systemctl start diet-planner
   ```

8. **Configure Nginx as reverse proxy:**

   ```bash
   sudo nano /etc/nginx/sites-available/diet-planner
   ```

   Add:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location /api {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location / {
           root /home/ubuntu/diet-planner/frontend;
           try_files $uri $uri/ =404;
       }
   }
   ```

9. **Enable the site:**

   ```bash
   sudo ln -s /etc/nginx/sites-available/diet-planner /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **Set up SSL with Let's Encrypt:**
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d your-domain.com
    ```

### Option 3: Deploy with Docker

#### Create Dockerfile in root:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Copy requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy application
COPY backend/ .
COPY data/ ../data/

EXPOSE 5000

ENV FLASK_APP=app.py
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
```

#### Create docker-compose.yml:

```yaml
version: "3.8"

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./data:/data

  frontend:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./frontend:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
```

#### Deploy:

```bash
docker-compose up -d
```

---

## Environment Setup

### Linux/Mac

1. Create `.env` file in backend directory:

   ```bash
   touch backend/.env
   ```

2. Add your OpenAI API key:
   ```bash
   echo "OPENAI_API_KEY=sk-..." >> backend/.env
   ```

### Windows PowerShell

```powershell
# Create .env file
New-Item -Path "backend\.env" -ItemType File

# Add your key (edit the file manually or use)
Add-Content -Path "backend\.env" -Value "OPENAI_API_KEY=sk-..."
```

### Getting Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (you won't see it again!)
5. Paste it in your `.env` file

---

## Performance Optimization

### Backend Optimization

1. **Use production WSGI server:**

   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Enable caching:**

   ```python
   from flask_caching import Cache
   cache = Cache(app, config={'CACHE_TYPE': 'simple'})
   ```

3. **Rate limiting:**
   ```python
   from flask_limiter import Limiter
   limiter = Limiter(app, key_func=lambda: "default")
   ```

### Frontend Optimization

1. **Minify CSS and JavaScript:**

   ```bash
   npm install -g terser cleancss-cli
   terser frontend/script.js -o frontend/script.min.js
   cleancss -o frontend/styles.min.css frontend/styles.css
   ```

2. **Use CDN for static files**
3. **Enable compression in Nginx:**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

---

## Monitoring & Logging

### Application Logs

```bash
# View Heroku logs
heroku logs --tail

# View systemd logs (AWS)
sudo journalctl -u diet-planner -f

# View Docker logs
docker-compose logs -f web
```

### Health Check Endpoint

The API includes a health check endpoint:

```
GET /api/health
```

Monitor this endpoint to ensure the service is running.

---

## Troubleshooting

### Issue: "Cannot connect to backend API"

**Solution:**

1. Verify Flask server is running: `http://127.0.0.1:5000/api/health`
2. Check firewall settings
3. Verify API URL in `script.js` matches your deployment

### Issue: "OPENAI_API_KEY not configured"

**Solution:**

1. Ensure `.env` file exists
2. Verify API key is correct
3. Check environment variable is loaded:
   ```python
   import os
   print(os.getenv('OPENAI_API_KEY'))
   ```

### Issue: "Cannot read properties of undefined"

**Solution:**

1. Verify JSON data files exist in `data/` directory
2. Check file paths are correct (relative to app.py)
3. Ensure JSON syntax is valid

### Issue: Slow responses from OpenAI API

**Solution:**

1. Check API rate limits
2. Implement request timeout
3. Add request queuing for concurrent requests

---

## Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Enable HTTPS** - Use SSL/TLS certificates
3. **Rate limiting** - Prevent API abuse
4. **CORS configuration** - Only allow trusted origins
5. **Input validation** - Sanitize all user inputs
6. **Update dependencies** - Regularly update packages

---

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review Flask and OpenAI API documentation
3. Check application logs
4. Create an issue in your repository

---

**Last Updated:** March 16, 2026
