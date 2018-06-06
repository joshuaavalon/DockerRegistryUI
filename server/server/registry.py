from json import JSONDecodeError
from logging import getLogger
from typing import Optional, Dict, Any
from urllib.parse import urljoin

from marshmallow import Schema, ValidationError
from requests import get, delete, head, Response

from .model import Catalog, Repository, Image
from .schema import CatalogSchema, RepositorySchema, ImageSchema

__all__ = ["Registry"]
logger = getLogger(__name__)


class Registry:
    base_url: str
    verify_ssl: bool
    authorization: Optional[str]
    catalog_schema: Schema
    repository_schema: Schema
    image_schema: Schema

    def __init__(self, base_url: str, verify_ssl: bool = True, authorization: Optional[str] = None):
        self.base_url = base_url
        self.verify_ssl = verify_ssl
        self.authorization = authorization
        self.catalog_schema = CatalogSchema()
        self.repository_schema = RepositorySchema()
        self.image_schema = ImageSchema()

    def get_catalog(self) -> Optional[Catalog]:
        url = self._get_url("./v2/_catalog")
        response = self._get(url)
        schema = self.catalog_schema
        return self._try_load(schema, response)

    def get_repository(self, repository: str) -> Optional[Repository]:
        url = self._get_url(f"./v2/{repository}/tags/list")
        response = self._get(url)
        schema = self.repository_schema
        return self._try_load(schema, response)

    def get_image(self, repository: str, tag_or_digest: str) -> Optional[Image]:
        digest = self.get_digest(repository, tag_or_digest)
        if digest is None:
            return None
        url = self._get_url(f"./v2/{repository}/manifests/{tag_or_digest}")
        response = self._get(url)
        schema = self.image_schema
        image = self._try_load(schema, response)
        if image is not None:
            image.digest = digest
        return image

    def delete_image(self, repository: str, digest: str) -> bool:
        url = self._get_url(f"./v2/{repository}/manifests/{digest}")
        response = self._delete(url)
        return response.status_code == 202

    def get_digest(self, repository: str, tag_or_digest: str) -> Optional[str]:
        url = self._get_url(f"./v2/{repository}/manifests/{tag_or_digest}")
        response = self._head(url)
        if 200 <= response.status_code < 300:
            return response.headers.get("Docker-Content-Digest", None)
        else:
            return None

    @staticmethod
    def _try_load(schema: Schema, response: Response) -> Any:
        if 200 <= response.status_code < 300:
            try:
                return schema.load(response.json())
            except JSONDecodeError as e:
                logger.exception(e.msg)
                return None
            except ValidationError as e:
                logger.exception(str(e.messages))
                return None
        else:
            return None

    def _get_url(self, path: str) -> str:
        return urljoin(self.base_url, path)

    @property
    def headers(self) -> Dict[str, str]:
        headers = {}
        if self.authorization is not None:
            headers["Authorization"] = self.authorization
        return headers

    def _get(self, url: str, **kwargs) -> Response:
        headers = self.headers
        headers["Accept"] = "application/vnd.docker.distribution.manifest.v1+json"
        return get(url, verify=self.verify_ssl, headers=headers, **kwargs)

    def _head(self, url: str, **kwargs) -> Response:
        headers = self.headers
        headers["Accept"] = "application/vnd.docker.distribution.manifest.v2+json"
        return head(url, verify=self.verify_ssl, headers=headers, **kwargs)

    def _delete(self, url: str, **kwargs) -> Response:
        headers = self.headers
        headers["Accept"] = "application/vnd.docker.distribution.manifest.v2+json"
        return delete(url, verify=self.verify_ssl, headers=headers, **kwargs)
