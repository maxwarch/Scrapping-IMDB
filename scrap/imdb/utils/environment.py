import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).absolute()
load_dotenv(os.path.join(BASE_DIR.parent.parent.parent.parent, ".env"))


def get_env(env_var: str = "") -> str:
    return os.environ.get(env_var) or open(os.environ.get(f"{env_var}_FILE")).read()
