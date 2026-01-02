#!/usr/bin/env python3
"""
Prepare source code excerpts for copyright registration.
Copies key files and redacts sensitive information.
"""

import os
import re
import shutil

PROJECT_DIR = "/home/ubuntu/solely-art-platform"
OUTPUT_DIR = "/home/ubuntu/solely-art-copyright-v2/03_Source_Code_Excerpt"

# Files to include (relative to project root)
FILES_TO_COPY = [
    # Main pages
    "client/src/pages/Home.tsx",
    "client/src/pages/About.tsx",
    "client/src/pages/Browse.tsx",
    "client/src/pages/Contact.tsx",
    "client/src/pages/ArtistProfile.tsx",
    "client/src/pages/BookArtist.tsx",
    "client/src/pages/Terms.tsx",
    "client/src/pages/Privacy.tsx",
    
    # Key components
    "client/src/components/NewsletterSignup.tsx",
    "client/src/components/UserAvatar.tsx",
    "client/src/components/LogoutButton.tsx",
    
    # Routing and app structure
    "client/src/App.tsx",
    "client/src/main.tsx",
    
    # Styling
    "client/src/index.css",
    
    # Backend routers
    "server/routers.ts",
    "server/routers/artists.ts",
    "server/routers/contact.ts",
    "server/routers/newsletter.ts",
    
    # Database
    "drizzle/schema.ts",
    "server/db.ts",
    
    # Email service
    "server/email.ts",
]

# Patterns to redact
REDACT_PATTERNS = [
    (r'(RESEND_API_KEY\s*[=:]\s*)["\'][^"\']+["\']', r'\1"[REDACTED]"'),
    (r'(API_KEY\s*[=:]\s*)["\'][^"\']+["\']', r'\1"[REDACTED]"'),
    (r'(SECRET\s*[=:]\s*)["\'][^"\']+["\']', r'\1"[REDACTED]"'),
    (r'(PASSWORD\s*[=:]\s*)["\'][^"\']+["\']', r'\1"[REDACTED]"'),
    (r'(DATABASE_URL\s*[=:]\s*)["\'][^"\']+["\']', r'\1"[REDACTED]"'),
    (r'(re_[a-zA-Z0-9]+)', r'[REDACTED_API_KEY]'),
    (r'(sk_[a-zA-Z0-9]+)', r'[REDACTED_KEY]'),
    (r'(pk_[a-zA-Z0-9]+)', r'[REDACTED_KEY]'),
]

def redact_content(content):
    """Apply redaction patterns to content."""
    for pattern, replacement in REDACT_PATTERNS:
        content = re.sub(pattern, replacement, content)
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
        
        return True
    except Exception as e:
        print(f"Error processing {src_path}: {e}")
        return False

def main():
    """Main function to prepare source code."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    success_count = 0
    for rel_path in FILES_TO_COPY:
        src_path = os.path.join(PROJECT_DIR, rel_path)
        dest_path = os.path.join(OUTPUT_DIR, rel_path)
        
        if os.path.exists(src_path):
            if copy_and_redact_file(src_path, dest_path):
                print(f"✓ Copied: {rel_path}")
                success_count += 1
            else:
                print(f"✗ Failed: {rel_path}")
        else:
            print(f"⚠ Not found: {rel_path}")
    
    print(f"\nCompleted: {success_count}/{len(FILES_TO_COPY)} files copied")

if __name__ == "__main__":
    main()
