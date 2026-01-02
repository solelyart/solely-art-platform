#!/usr/bin/env python3
"""
Script to add data-testid attributes to Solely Art platform components.
This ensures comprehensive test coverage with Playwright.
"""

import re
import os
from pathlib import Path

# Define mappings of patterns to test IDs
TEST_ID_MAPPINGS = {
    # Authentication & Navigation
    r'<a href=\{getLoginUrl\(\)\}>Sign In</a>': r'<a href={getLoginUrl()} data-testid="login-button">Sign In</a>',
    r'<LogoutButton />': r'<LogoutButton data-testid="logout-button" />',
    r'<button\s+onClick=\{\(\) => window\.location\.href = \'/dashboard\'\}': r'<button data-testid="user-menu" onClick={() => window.location.href = \'/dashboard\'}',
    r'<Link href="/browse"([^>]*)>Browse Artists</Link>': r'<Link href="/browse"\1 data-testid="nav-browse">Browse Artists</Link>',
    r'<Link href="/dashboard"([^>]*)>Dashboard</Link>': r'<Link href="/dashboard"\1 data-testid="nav-dashboard">Dashboard</Link>',
    r'<Link href="/become-artist">Become an Artist</Link>': r'<Link href="/become-artist" data-testid="nav-become-artist">Become an Artist</Link>',
    
    # Search
    r'<Input\s+placeholder="Search artists': r'<Input data-testid="search-input" placeholder="Search artists',
    r'<Link href=\{`/browse\?q=\$\{encodeURIComponent\(searchTerm\)\}`\}>\s*Search': r'<Link href={`/browse?q=${encodeURIComponent(searchTerm)}`} data-testid="search-button">\n                  Search',
    
    # Hero
    r'<h1 className="mb-8 text-6xl': r'<h1 data-testid="hero-title" className="mb-8 text-6xl',
    
    # Category cards
    r'<Card className="group hover-lift border-border/50 bg-card/80 backdrop-blur-sm shadow-elegant">': r'<Card className="group hover-lift border-border/50 bg-card/80 backdrop-blur-sm shadow-elegant" data-testid="category-card">',
    
    # Artist cards
    r'<Card className="group overflow-hidden hover-lift': r'<Card className="group overflow-hidden hover-lift" data-testid="artist-card"',
    r'<Card className="group hover-lift overflow-hidden': r'<Card className="group hover-lift overflow-hidden" data-testid="artist-card"',
}

def add_test_ids_to_file(file_path):
    """Add data-testid attributes to a single file."""
    print(f"Processing: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        modifications = 0
        
        # Apply each mapping
        for pattern, replacement in TEST_ID_MAPPINGS.items():
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                modifications += 1
        
        # Only write if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ Added {modifications} test IDs")
            return modifications
        else:
            print(f"  - No changes needed")
            return 0
            
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return 0

def main():
    """Main function to process all component files."""
    project_root = Path("/home/ubuntu/solely-art-platform")
    pages_dir = project_root / "client" / "src" / "pages"
    components_dir = project_root / "client" / "src" / "components"
    
    print("=" * 60)
    print("Adding data-testid attributes to Solely Art components")
    print("=" * 60)
    print()
    
    total_modifications = 0
    
    # Process page components
    print("Processing page components...")
    for tsx_file in pages_dir.glob("*.tsx"):
        mods = add_test_ids_to_file(tsx_file)
        total_modifications += mods
    
    print()
    print("=" * 60)
    print(f"Complete! Total modifications: {total_modifications}")
    print("=" * 60)
    
    # Create a summary file
    summary_path = project_root / "e2e-tests" / "TEST_IDS_ADDED.md"
    with open(summary_path, 'w') as f:
        f.write("# Test IDs Added - Summary\n\n")
        f.write(f"Total modifications made: {total_modifications}\n\n")
        f.write("## Next Steps\n\n")
        f.write("1. Review the changes in each component\n")
        f.write("2. Add remaining test IDs manually for complex components\n")
        f.write("3. Update Playwright tests to use these selectors\n")
        f.write("4. Run tests to validate\n")
    
    print(f"\nSummary written to: {summary_path}")

if __name__ == "__main__":
    main()
