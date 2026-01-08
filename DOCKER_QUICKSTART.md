# Docker Quickstart

## Pull the image from GHCR
```bash
docker pull ghcr.io/tipp88/iobroker-dashboard:latest
```

## Run the container
```bash
docker run -d \
  --name iobroker-dashboard \
  -p 8080:80 \
  --restart unless-stopped \
  ghcr.io/tipp88/iobroker-dashboard:latest
```

Open the dashboard at:
- http://<host-ip>:8080

## Update to the latest image
```bash
docker pull ghcr.io/tipp88/iobroker-dashboard:latest
docker stop iobroker-dashboard
docker rm iobroker-dashboard
docker run -d \
  --name iobroker-dashboard \
  -p 8080:80 \
  --restart unless-stopped \
  ghcr.io/tipp88/iobroker-dashboard:latest
```

## Optional: run on port 80
```bash
docker run -d \
  --name iobroker-dashboard \
  -p 80:80 \
  --restart unless-stopped \
  ghcr.io/tipp88/iobroker-dashboard:latest
```
