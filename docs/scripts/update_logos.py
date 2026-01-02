#!/usr/bin/env python3
"""
Update all pages to use the new ResponsiveLogo components
"""

import os
import re

PAGES_DIR = "/home/ubuntu/solely-art-platform/client/src/pages"
COMPONENTS_DIR = "/home/ubuntu/solely-art-platform/client/src/components"

# Files to update
files_to_update = [
    f"{PAGES_DIR}/About.tsx",
    f"{PAGES_DIR}/Browse.tsx",
    f"{PAGES_DIR}/Contact.tsx",
    f"{PAGES_DIR}/Terms.tsx",
    f"{PAGES_DIR}/Privacy.tsx",
    f"{PAGES_DIR}/Dashboard.tsx",
    f"{PAGES_DIR}/ArtistProfile.tsx",
    f"{PAGES_DIR}/BookArtist.tsx",
    f"{COMPONENTS_DIR}/DashboardLayout.tsx",
]

def update_file(filepath):
    """Update a single file with responsive logo components"""
    if not os.path.exists(filepath):
        print(f"⚠️  File not found: {filepath}")
        return False
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # Check if already has ResponsiveLogo import
    has_import = 'ResponsiveLogo' in content or 'HeaderLogo' in content or 'FooterLogo' in content
    
    # Add import if needed
    if not has_import:
        # Find the last import line
        import_pattern = r'(import .+ from ["\'][^"\']+["\'];?\n)(?!import)'
        match = re.search(import_pattern, content)
        if match:
            insert_pos = match.end()
            import_line = 'import { HeaderLogo, FooterLogo } from "@/components/ResponsiveLogo";\n'
            content = content[:insert_pos] + import_line + content[insert_pos:]
    
    # Replace header logo patterns
    header_patterns = [
        # Pattern 1: Link wrapper with img
        (r'<Link href="/" className="[^"]*">\s*<img\s+src="/brand/sla-header-logo\.png"\s+alt="[^"]*"\s+className="[^"]*"\s*/>\s*</Link>',
         '<HeaderLogo />'),
        # Pattern 2: Just img tag
        (r'<img\s+src="/brand/sla-header-logo\.png"\s+alt="[^"]*"\s+className="h-\d+[^"]*"[^/]*/?>',
         '<HeaderLogo />'),
        # Pattern 3: img with different attribute order
        (r'<img\s+[^>]*src="/brand/sla-header-logo\.png"[^>]*/?>',
         '<HeaderLogo />'),
    ]
    
    for pattern, replacement in header_patterns:
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Replace footer logo patterns
    footer_patterns = [
        # Pattern 1: Full logo in footer
        (r'<img\s+src="/brand/sla-logo-full-(?:lg|md)\.png"\s+alt="[^"]*"\s+className="[^"]*"\s*/?>',
         '<FooterLogo />'),
        # Pattern 2: Different attribute order
        (r'<img\s+[^>]*src="/brand/sla-logo-full-(?:lg|md)\.png"[^>]*/?>',
         '<FooterLogo />'),
    ]
    
    for pattern, replacement in footer_patterns:
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"✅ Updated: {os.path.basename(filepath)}")
        return True
    else:
        print(f"ℹ️  No changes needed: {os.path.basename(filepath)}")
        return False

def main():
    print("=" * 60)
    print("UPDATING PAGES WITH RESPONSIVE LOGO COMPONENTS")
    print("=" * 60)
    
    updated_count = 0
    for filepath in files_to_update:
        if update_file(filepath):
            updated_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ Updated {updated_count} files")
    print("=" * 60)

if __name__ == "__main__":
    main()
