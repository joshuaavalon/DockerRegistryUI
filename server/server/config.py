import os

DEBUG = bool(os.environ.get("DEBUG", False))

REGISTRY_URL = os.environ.get("REGISTRY_URL", "http://localhost:5000/")

REGISTRY_VERIFY_SSL = bool(os.environ.get("REGISTRY_VERIFY_SSL", True))

REGISTRY_AUTHORIZATION = os.environ.get("REGISTRY_AUTHORIZATION", None)
