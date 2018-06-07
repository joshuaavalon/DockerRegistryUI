# DockerRegistryUI

Simple docker registry web UI. This is designed to work with [registry](https://hub.docker.com/r/_/registry/) v2.

**Note that this is design for managing LOCAL registry. Hence, it does not have authorization functions**

## Deploy
```
docker run -p 8080:80 -e "REGISTRY_URL=http://localhost:5000/" -d joshuaavalon/docker-registry-ui
```

## Configuration

These configurations can be set by environment variables.

* `DEBUG`: Set to True to enable Flask debug mode.
* `REGISTRY_URL`: Required. Set to registry API. E.g. `http://localhost:5000/`
* `REGISTRY_VERIFY_SSL`: Set to False to ignore SSL error.
* `REGISTRY_AUTHORIZATION`: Authorization header for the API access.