import os

DEBUG = os.environ.get("DEBUG", "false").lower() == "true"

REGISTRY_URL = os.environ.get("REGISTRY_URL", "http://localhost:5000/")

REGISTRY_VERIFY_SSL = bool(os.environ.get("REGISTRY_VERIFY_SSL", True))

REGISTRY_AUTHORIZATION = os.environ.get("REGISTRY_AUTHORIZATION", None)
