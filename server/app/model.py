from typing import List, Optional

__all__ = ["Catalog", "Repository", "Image"]


class Base:
    def __repr__(self):
        return str(vars(self))


class Catalog(Base):
    repositories: List[str]

    def __init__(self, repositories: List[str] = None):
        self.repositories = repositories if repositories is not None else []


class Repository(Base):
    name: str
    tags: List[str]

    def __init__(self, name: str, tags: List[str] = None):
        self.name = name
        self.tags = tags if tags is not None else []


class Image(Base):
    name: str
    tag: str
    architecture: str
    digest: Optional[str]

    def __init__(self, name: str, tag: str, architecture: str, digest: Optional[str] = None):
        self.name = name
        self.tag = tag
        self.architecture = architecture
        self.digest = digest
