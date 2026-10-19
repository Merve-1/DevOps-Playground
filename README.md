# Docker for .NET Developer – Learning Notes

This repository contains my learning journey while studying the course **[Docker for .NET Developer](https://www.udemy.com/course/docker-for-dot-net-developer/)** 
---

## Requirements

To follow along with this repository, you need to set up the following tools on your machine:

---

### Windows Subsystem for Linux (WSL)

WSL allows you to run Linux commands on Windows, which works smoothly with Docker.

**Install:**

```bash
wsl --install -d Ubuntu-22.04
```

Restart your PC, then complete the Linux setup when prompted.

**Verify:**

```bash
wsl -l -v
```

---

### Docker Desktop

Docker Desktop is required to build and run containers.

**Install:**

* Download from: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
* Install with default settings
* Enable **WSL 2 integration** during setup

**Verify:**

```bash
docker --version
docker run hello-world
```

---

### System Requirements

* Windows 10/11 (64-bit)
* Virtualization enabled (BIOS)
* 8 GB RAM minimum (16 GB recommended)
* Latest Windows updates installed
  
---
## What is Docker?

Docker is a tool that lets you package an application together with everything it needs to run (like libraries, dependencies, and settings) into a single unit called a **container**.

Think of it like this:

- Normally, an application might work on your machine but break on someone else’s because of missing dependencies or different environments.
- Docker solves this by making sure the app runs the same everywhere.

---

## Why Docker is useful

- Consistency → Works the same on every machine  
- Isolation → Each app runs in its own container  
- Portability → Easy to move between development, testing, and production  
- Efficiency → Lighter than full virtual machines  
- Fast setup → No need to install all dependencies manually  

---

## Key Concepts 

<img width="1693" height="929" alt="85e3ea8b-e75f-454f-a63a-97b761419c35" src="https://github.com/user-attachments/assets/d7c28865-96a5-457c-ae92-24ce94653148" />

### Image
A blueprint of your application. It contains everything needed to run the app.

### Container
A running instance of an image. Think of it as the “live app”.

### Dockerfile
A script that tells Docker how to build an image step by step.

### Docker Hub
A public registry where Docker images are stored and shared.

---

## Basic Workflow

1. Write your application 
2. Create a Dockerfile  
3. Build a Docker image  
4. Run it as a container  
5. Test and deploy anywhere  

```
Dockerfile
     │
     ▼
 Build Image
     │
     ▼
 Docker Image
     │
     ├──► Container 1
     ├──► Container 2
     └──► Container 3

Docker Hub
     │
     └── Stores Images
```     
---

## Course Progress

-  Docker basics  
-  Creating Dockerfiles for .NET apps  
-  Working with containers  
-  Multi-container applications  
-  Deployment practices  

---
Notes: https://www.notion.so/Docker-for-Dotnet-37c7a1b71e4180c3acece2bdf6cedcde?source=copy_link

This repository is for learning and practice. 
It will evolve as I progress in my learning journey...
