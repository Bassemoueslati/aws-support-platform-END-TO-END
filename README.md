# AWS SupportDesk Starter

Projet DevOps/Cloud simple pour un profil junior.

## Type de projet
Plateforme de gestion de tickets support (Support Ticket Management).

## Stack
- Backend: Python FastAPI
- Frontend: React (simple page)
- Containers: Docker + Docker Compose
- Cloud IaC: Terraform AWS (simple: VPC + EKS + EC2)
- Config: Ansible
- Monitoring: Prometheus + Grafana
- CI/CD: GitHub Actions

## Lancer en local
```bash
docker compose up --build
```

## Lancer monitoring
```bash
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000/health
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001
