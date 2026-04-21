# Task.ly - Enterprise-Grade Task Management

Task.ly is a secure, full-stack task management application featuring a modern **glassmorphism UI**.  
It is engineered for **production deployment** using Docker and Kubernetes on **AWS**.

---

## System Architecture

The application follows a **Dev/Prod split architecture**:

### 🔹 Local Development
- Runs natively using **Node.js** and **Vite**
- Fast iteration and debugging

### 🔹 Cloud Production
- Containerized using **Docker**
- Deployed on **Kubernetes (K3s)** cluster on AWS EC2
- Uses **NGINX Reverse Proxy** for secure routing

---

## 📂 Project Structure

```
TASKMANAGER/
│
├── TaskBackend/               
│   ├── k8s/                   
│   │   ├── k8s-deployment.yaml  
│   │   ├── k8s-secret.yaml      
│   │   └── k8s-service.yaml     
│   ├── src/                   
│   ├── Dockerfile             
│   └── package.json           
│
├── TaskFront/front-end/       
│   ├── k8s/                   
│   │   ├── k8s-frontend-deployment.yaml 
│   │   └── k8s-frontend-service.yaml    
│   ├── src/                   
│   ├── Dockerfile             
│   └── package.json           
│
└── README.md                  
```

---

## Core Features & Security Implementations

### Secure Authentication (OAuth 2.0 & JWT)

- JWT-based authentication for sessions
- Google OAuth 2.0 integration

**Features:**
- Secure token handling (Storing in cookies)
- Seamless frontend-backend session flow

---

### Payment Gateway (Razorpay)

- Integrated Razorpay for pro features

**Security:**
- Backend generates secure Order IDs
- Payment signature verification prevents tampering

---

### API Rate Limiting and indexing (Redis)

- Protects APIs from:
  - DDoS attacks
  - Brute-force login attempts

- Implemented using **Redis** as Cache DB in between the Node js Pod and MongoDB

---

## Containerization (Docker)

Docker ensures consistent environments across development and production.

### Docker Workflow

```bash
# Build backend image
docker build -t seshasathvik/taskly-backend:v11 .

# Push to Docker Hub
docker push seshasathvik/taskly-backend:v11
```

### Images Used
- `seshasathvik/taskly-backend:v11`
- `seshasathvik/taskly-frontend:v3`

---

## Orchestration (Kubernetes (minikube) / K3s (AWS))

Kubernetes manages deployment, scaling, and networking of containers.

### What is a Pod?
- Smallest deployable unit in Kubernetes
- Backend and frontend run in **separate pods**

---

### Backend Kubernetes Files

- **k8s-secret.yaml**
  - Stores sensitive data (MongoDB URI, JWT secrets)

- **k8s-deployment.yaml**
  - Defines container configuration and ensures uptime

- **k8s-service.yaml**
  - Exposes backend internally for communication

---

### Useful Kubernetes Commands

```bash
# Apply configuration
sudo k3s kubectl apply -f <filename.yaml>

# Check running pods
sudo k3s kubectl get pods

# View logs
sudo k3s kubectl logs <pod-name>
```

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|------------|
| POST   | `/register` | Register new user |
| POST   | `/login` | Login & get JWT |
| GET    | `/google` | Start Google OAuth |
| GET    | `/google/callback` | Handle OAuth redirect |

---

### Tasks (`/api/tasks`)

| Method | Endpoint | Description |
|--------|----------|------------|
| GET    | `/` | Fetch & decrypt tasks |
| POST   | `/` | Encrypt & create task |
| PATCH  | `/:id` | Update & re-encrypt task |
| DELETE | `/:id` | Delete task |

---

### Payments (`/api/payment`)

| Method | Endpoint | Description |
|--------|----------|------------|
| POST   | `/create-order` | Create Razorpay order |
| POST   | `/verify` | Verify payment signature |

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Security:** JWT, OAuth 2.0, ChaCha20-Poly1305
- **DevOps:** Docker, Kubernetes (K3s), AWS EC2
- **Caching:** Redis
- **Payments:** Razorpay

---

## Deployment Summary

1. Build Docker images  
2. Push to Docker Hub  
3. Apply Kubernetes YAML configs  
4. Expose services via NGINX  
5. Monitor using `kubectl`

---

## Author

**Sesha Sathvik**  

---
