#!/usr/bin/env python3
"""
Prepare source code excerpts for copyright registration.
Copies key files and redacts sensitive information.
"""

import os
import re
import shutil

PROJECT_DIR = "/home/ubuntu/solely-art-platform"
OUTPUT_DIR = "/home/ubuntu/solely-art-copyright/source-code"

# Key frontend files to include
FRONTEND_FILES = [
    "client/src/pages/Home.tsx",
    "client/src/pages/About.tsx",
    "client/src/pages/Browse.tsx",
    "client/src/pages/ArtistProfile.tsx",
    "client/src/pages/BookArtist.tsx",
    "client/src/pages/Dashboard.tsx",
    "client/src/pages/Messages.tsx",
    "client/src/pages/PortfolioBuilder.tsx",
    "client/src/pages/Terms.tsx",
    "client/src/pages/Privacy.tsx",
    "client/src/pages/Contact.tsx",
    "client/src/components/BookingCalendar.tsx",
    "client/src/components/PortfolioDisplay.tsx",
    "client/src/components/AvailabilityPreview.tsx",
    "client/src/App.tsx",
    "client/src/index.css",
]

# Key backend files to include
BACKEND_FILES = [
    "server/db.ts",
    "server/routers.ts",
    "server/notifications.ts",
    "server/storage.ts",
    "server/routers/artists.ts",
    "server/routers/availability.ts",
    "server/routers/bookings.ts",
    "server/routers/messaging.ts",
    "server/routers/portfolio.ts",
    "server/routers/services.ts",
    "drizzle/schema.ts",
]

# Patterns to redact
REDACT_PATTERNS = [
    (r'(API_KEY|SECRET|PASSWORD|TOKEN|CREDENTIAL)["\']?\s*[:=]\s*["\'][^"\']+["\']', r'\1 = "[REDACTED]"'),
    (r'(sk_live_|sk_test_|pk_live_|pk_test_)[a-zA-Z0-9]+', '[STRIPE_KEY_REDACTED]'),
    (r'Bearer\s+[a-zA-Z0-9\-_.]+', 'Bearer [TOKEN_REDACTED]'),
    (r'(https?://[a-zA-Z0-9\-_.]+\.manusvm\.computer)', '[MANUS_URL_REDACTED]'),
]

def redact_content(content):
    """Redact sensitive information from content."""
    for pattern, replacement in REDACT_PATTERNS:
        content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
    return content

def copy_and_redact_file(src_path, dest_path):
    """Copy a file and redact sensitive information."""
    try:
        with open(src_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Redact sensitive information
        content = redact_content(content)
        
        # Ensure destination directory exists
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  Copied: {src_path} -> {dest_path}")
        return True
    except Exception as e:
        print(f"  Error copying {src_path}: {e}")
        return False

def main():
    print("Preparing source code excerpts for copyright registration...\n")
    
    # Create output directories
    frontend_dir = os.path.join(OUTPUT_DIR, "frontend")
    backend_dir = os.path.join(OUTPUT_DIR, "backend")
    os.makedirs(frontend_dir, exist_ok=True)
    os.makedirs(backend_dir, exist_ok=True)
    
    # Copy frontend files
    print("Frontend Files:")
    for file_path in FRONTEND_FILES:
        src = os.path.join(PROJECT_DIR, file_path)
        dest = os.path.join(frontend_dir, os.path.basename(file_path))
        copy_and_redact_file(src, dest)
    
    print("\nBackend Files:")
    for file_path in BACKEND_FILES:
        src = os.path.join(PROJECT_DIR, file_path)
        # Preserve directory structure for routers
        if "routers/" in file_path:
            dest = os.path.join(backend_dir, "routers", os.path.basename(file_path))
        else:
            dest = os.path.join(backend_dir, os.path.basename(file_path))
        copy_and_redact_file(src, dest)
    
    # Create a README for the source code
    readme_content = """# Solely Art Platform - Source Code Excerpts

**Copyright © 2025 Solely Art. All Rights Reserved.**

This directory contains excerpts of the Solely Art platform source code for copyright registration purposes.

## Directory Structure

```
source-code/
├── frontend/           # React/TypeScript frontend components
│   ├── Home.tsx        # Homepage component
│   ├── About.tsx       # About page
│   ├── Browse.tsx      # Artist browsing page
│   ├── ArtistProfile.tsx # Artist profile page
│   ├── BookArtist.tsx  # Booking flow
│   ├── Dashboard.tsx   # User dashboard
│   ├── Messages.tsx    # Messaging system
│   ├── PortfolioBuilder.tsx # Portfolio management
│   ├── Terms.tsx       # Terms of Service page
│   ├── Privacy.tsx     # Privacy Policy page
│   ├── Contact.tsx     # Contact page
│   ├── BookingCalendar.tsx # Calendar component
│   ├── PortfolioDisplay.tsx # Portfolio display
│   ├── AvailabilityPreview.tsx # Availability preview
│   ├── App.tsx         # Main application router
│   └── index.css       # Global styles
│
└── backend/            # Node.js/Express/tRPC backend
    ├── db.ts           # Database operations
    ├── routers.ts      # Main tRPC router
    ├── notifications.ts # Notification system
    ├── storage.ts      # S3 storage integration
    ├── schema.ts       # Database schema (Drizzle ORM)
    └── routers/        # Feature-specific routers
        ├── artists.ts
        ├── availability.ts
        ├── bookings.ts
        ├── messaging.ts
        ├── portfolio.ts
        └── services.ts
```

## Technology Stack

- **Frontend:** React 19, TypeScript, TailwindCSS 4
- **Backend:** Node.js, Express, tRPC 11
- **Database:** SQLite with Drizzle ORM
- **Authentication:** Manus OAuth
- **Storage:** S3-compatible object storage

## Note

Sensitive information (API keys, secrets, URLs) has been redacted from these files for security purposes.

**Prepared:** December 20, 2025
**Author:** Kristen Blanks, Founder & CEO
"""
    
    readme_path = os.path.join(OUTPUT_DIR, "README.md")
    with open(readme_path, 'w') as f:
        f.write(readme_content)
    print(f"\nCreated: {readme_path}")
    
    print(f"\nSource code excerpts saved to: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
