import os
import sys
import webbrowser
import uvicorn
from pathlib import Path

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent

if __name__ == "__main__":
    # Add backend directory to sys.path
    sys.path.insert(0, str(BASE_DIR / "backend"))

    port = int(os.getenv("PORT", "8000"))
    url = f"http://localhost:{port}"

    print("=" * 60)
    print(" 🚀 Ego-Browser YouTube Scout & Studio Server Starting...")
    print(f" 🌐 Access Studio at: {url}")
    print("=" * 60)

    # Open browser automatically in user session
    try:
        webbrowser.open(url)
    except Exception:
        pass

    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)
