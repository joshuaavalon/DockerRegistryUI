from flask import Flask, abort, jsonify

from app.registry import Registry
from app.schema import CatalogDetailSchema, RepositoryDetailSchema

app = Flask(__name__)
app.config.from_object("app.config")
app.config.from_envvar("APP_CONFIG", silent=True)
registry = Registry(base_url=app.config["REGISTRY_URL"],
                    verify_ssl=app.config["REGISTRY_VERIFY_SSL"],
                    authorization=app.config["REGISTRY_AUTHORIZATION"])


@app.route("/catalog/")
def get_catalog():
    catalog = registry.get_catalog()
    if catalog is None:
        abort(404)
    repositories = []
    for repository_name in catalog.repositories:
        repository = registry.get_repository(repository_name)
        repositories.append(repository)
    schema = CatalogDetailSchema()
    return jsonify(schema.dump({"repositories": repositories}))


@app.route("/repository/<repository_name>/")
def get_repository(repository_name: str):
    repository = registry.get_repository(repository_name)
    if repository is None:
        abort(404)
    images = []
    for tag in repository.tags:
        image = registry.get_image(repository_name, tag)
        images.append(image)
    schema = RepositoryDetailSchema()
    repository_detail = {
        "name": repository.name,
        "tags": images
    }
    return jsonify(schema.dump(repository_detail))


@app.route("/repository/<repository_name>/<digest>/", methods=["DELETE"])
def delete_repository(repository_name: str, digest: str):
    result = registry.delete_image(repository_name, digest)
    if not result:
        return jsonify(success=False), 404
    return jsonify(success=True)


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


@app.route("/")
def index():
    return app.send_static_file("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
