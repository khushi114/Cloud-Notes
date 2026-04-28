#!/bin/bash
# Cloud Notes - EC2 Server Setup Script
# Run this on your Ubuntu EC2 instance after SSH-ing in

echo "======================================="
echo "   Cloud Notes - EC2 Setup Script"
echo "======================================="

# 1. Update system packages
echo "[1/7] Updating system packages..."
sudo apt-get update -y && sudo apt-get upgrade -y

# 2. Install Node.js (v18 LTS)
echo "[2/7] Installing Node.js v18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3. Install Git
echo "[3/7] Installing Git..."
sudo apt-get install -y git

# 4. Install PM2 (process manager)
echo "[4/7] Installing PM2..."
sudo npm install -g pm2

# 5. Install Nginx
echo "[5/7] Installing Nginx..."
sudo apt-get install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 6. Clone the repository
echo "[6/7] Cloning repository..."
cd /home/ubuntu
git clone https://github.com/khushi114/Cloud-Notes.git
cd /home/ubuntu/Cloud-Notes/backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

echo "[7/7] Setup complete!"
echo ""
echo "======================================="
echo "NEXT STEPS:"
echo "1. Create your .env file:"
echo "   nano /home/ubuntu/Cloud-Notes/backend/.env"
echo ""
echo "2. Start the server with PM2:"
echo "   pm2 start server.js --name cloud-notes-backend"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "3. Configure Nginx (see nginx.conf instructions)"
echo "======================================="
