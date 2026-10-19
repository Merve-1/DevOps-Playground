# Step #01

### Go to [https://hub.docker.com/repositories](https://hub.docker.com/repositories)

![alt text](/images/image.png)

---

### Then search for the “Hello World” image

![alt text](/images/image-1.png)

> I am using WSL because it makes it easier for me to switch between commands. You can also use the normal terminal without any issues.

---

### Commands

```bash
docker --version
docker images
docker pull hello-world
```

![alt text](/images/image-2.png)

---

### Docker Desktop App

![alt text](/images/image-3.png)

---

### Run a container

![alt text](/images/image-4.png)

```bash
docker run <image-name>
```

---

### To remove a container, use:

```bash
docker rm <container-id>
```

---

### To remove a Docker image:

```bash
docker rmi <image-name or image-id>
```

---

![alt text](/images/image-5.png)

---

```
docker pull mrc.microsoft.com/dotnet/sdk
docker images
```

![alt text](/images/image-6.png)


### Delete image with 
```
docker rmi <image-id> 
#or 
docker rmi <image-id> -f
```
![alt text](/images/image-7.png)


## Ubuntu Container 
### Commands
```
docker pull ubuntu
#or
docker run -d ubuntu sleep 10 
docker ps -a
``` 
![alt text](images/image-8.png)

## nginx Image 
### Commands
```
docker scout quickview nginx
```

![alt text](images/image-9.png)

## Dockerfile
![alt text](images/image-10.png)
repo name must be lowercase 
ensure the syntax in the dockerfile is correct 