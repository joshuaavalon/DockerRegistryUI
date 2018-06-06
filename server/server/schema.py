from typing import Dict, Any

from marshmallow import Schema, fields, post_load

from .model import Catalog, Repository, Image

__all__ = ["CatalogSchema", "RepositorySchema", "ImageSchema", "CatalogDetailSchema",  "RepositoryDetailSchema"]


class CatalogSchema(Schema):
    repositories = fields.List(fields.Str(), required=True)

    @post_load
    def deserialize(self, data: Dict[str, Any]) -> Catalog:
        return Catalog(**data)


class RepositorySchema(Schema):
    name = fields.Str(required=True)
    tags = fields.List(fields.Str(), required=True, allow_none=True)

    @post_load
    def deserialize(self, data: Dict[str, Any]) -> Repository:
        return Repository(**data)


class CatalogDetailSchema(Schema):
    repositories = fields.Nested(RepositorySchema, many=True)


class ImageSchema(Schema):
    name = fields.Str(required=True)
    tag = fields.Str(required=True)
    architecture = fields.Str(required=True)
    digest = fields.Str(required=True, dump_only=True)

    @post_load
    def deserialize(self, data: Dict[str, Any]) -> Image:
        return Image(**data)


class RepositoryDetailSchema(Schema):
    name = fields.Str(required=True)
    tags = fields.Nested(ImageSchema, many=True)
