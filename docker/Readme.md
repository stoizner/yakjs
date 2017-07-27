# Build yakjs docker image
To build a yakjs docker image, use the `docker build` command:
```
docker build -t yakjs github.com/cschuller/yakjs#:docker
```

# Run yakjs docker image

To create and run a new container using the previously created yakjs image, use the following command:

```
docker run -d -p 8790:8790 -p 9000-9099:9000-9099 --name yakjs-demo yakjs -e YAKJS_NO_LOCALHOST_RESTRICTION=true
```

To stop and start this yakjs instance, you can then use the following commands:
```
docker stop yakjs-demo

docker start yakjs-demo
```

# Cleaning up

To remove the container use:
```
docker stop yakjs-demo
docker rm yakjs-demo
```

The built image can be removed using:
```
docker rmi yakjs
```

# Trouble shooting

To connect to the running container  use:
```
docker exec -t -i yakjs-demo /bin/bash
```

The log files can be found under:
```
/usr/local/lib/node_modules/yakjs/logs/
```
