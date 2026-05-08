import os
import re

files_to_check = [
    "package.json",
    "ARCHITECTURE_MANIFEST.md",
    "packages/web/wrangler.toml",
    "packages/web/package.json",
    "packages/web/src/components/layout/Footer.tsx",
    "packages/web/src/components/layout/Header.tsx",
    "packages/web/src/App.tsx",
    "packages/web/src/index.css",
    "packages/web/src/lib/theme.tsx",
    "packages/web/index.html",
    "requirements.md",
    "packages/api/wrangler.toml",
    "packages/api/package.json",
    "packages/api/src/lib/errors.ts",
    "packages/api/src/index.ts",
    "packages/api/src/routes/portfolio.ts"
]

for f in files_to_check:
    path = os.path.join('/home/simon/Projects/Personal/monofolio', f)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        new_content = re.sub(r'monofolio', 'refolio', content)
        new_content = re.sub(r'Monofolio', 'Refolio', new_content)
        new_content = re.sub(r'MONOFOLIO', 'REFOLIO', new_content)
        
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Updated {f}")
