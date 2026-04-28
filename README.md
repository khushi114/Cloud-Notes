# Cloud-Based Notes Sharing System

A full-stack web application integrated with AWS S3 for file storage and Firebase Firestore for metadata management. Built with React (Vite) and Node.js/Express.

## Prerequisites

- Node.js (v18 or newer)
- AWS Account with S3 bucket and IAM credentials
- Firebase Project with Firestore enabled and a Service Account Key

## Setup & Local Development

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
4. Fill in the `.env` file with your AWS and Firebase credentials.
5. Start the server:
   ```bash
   node server.js
   ```
   The backend should now be running on `http://localhost:5000`.

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser (typically `http://localhost:5173`).

---

## Deployment Instructions

### Deploying the Backend (AWS EC2)

1. **Launch an EC2 Instance**:
   - Go to AWS Console -> EC2 -> Launch Instance.
   - Choose Ubuntu or Amazon Linux.
   - Configure Security Group to allow inbound traffic on HTTP (80), HTTPS (443), and port 5000 (Custom TCP).

2. **Connect to your Instance**:
   - SSH into your instance using your key pair.

3. **Install Node.js & Git**:
   ```bash
   # For Ubuntu:
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs git
   ```

4. **Clone your repository & Install Dependencies**:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-directory>/backend
   npm install
   ```

5. **Set Environment Variables**:
   - Create a `.env` file and populate it with your AWS and Firebase keys.

6. **Process Manager (PM2)**:
   - Install PM2 to keep the app running in the background:
     ```bash
     sudo npm install -g pm2
     pm2 start server.js --name "notes-backend"
     pm2 save
     pm2 startup
     ```

### Deploying the Frontend (Vercel, Netlify, or AWS S3/CloudFront)

**Using Vercel (Recommended):**
1. Push your code to GitHub.
2. Log in to Vercel and click "Add New Project".
3. Import your repository and set the Root Directory to `frontend`.
4. Add the `VITE_API_URL` environment variable pointing to your deployed backend URL (e.g., `http://<ec2-public-ip>:5000/api`).
5. Click "Deploy".

**Using AWS S3 (Static Hosting):**
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Create an S3 Bucket and enable "Static website hosting".
3. Upload the contents of the `frontend/dist` folder to the S3 bucket.
4. Ensure the bucket policy allows public read access to the objects.
