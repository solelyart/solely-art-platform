#!/usr/bin/env python3
"""
Script to analyze Monday.com board for duplicate tasks.
Fetches all items, identifies duplicates based on name similarity, and prepares merge recommendations.
"""

import json
import subprocess
import sys
from difflib import SequenceMatcher

BOARD_ID = 18391050422

def fetch_all_items():
    """Fetch all items from the board using pagination"""
    all_items = []
    next_cursor = None
    page = 1
    
    print("Fetching all items from board...")
    
    while True:
        print(f"  Fetching page {page}...", end=" ")
        
        # Build input
        input_data = {
            "boardId": BOARD_ID,
            "limit": 100,
            "includeColumns": True
        }
        
        if next_cursor:
            input_data["nextCursor"] = next_cursor
        
        input_json = json.dumps(input_data)
        
        # Call Monday.com MCP tool
        cmd = [
            "manus-mcp-cli", "tool", "call", "get_board_items_page",
            "--server", "monday-com",
            "--input", input_json
        ]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True, timeout=60)
            
            # Parse result - look for JSON in output
            output_lines = result.stdout.strip().split('\n')
            json_str = None
            for i, line in enumerate(output_lines):
                if line.strip().startswith('{'):
                    json_str = '\n'.join(output_lines[i:])
                    break
            
            if not json_str:
                print(f"❌ Failed to parse JSON from output")
                break
            
            data = json.loads(json_str)
            
            items = data.get("items", [])
            all_items.extend(items)
            print(f"✅ Got {len(items)} items")
            
            pagination = data.get("pagination", {})
            has_more = pagination.get("has_more", False)
            next_cursor = pagination.get("nextCursor")
            
            if not has_more:
                break
            
            page += 1
            
        except subprocess.TimeoutExpired:
            print(f"⏱️  Timeout")
            break
        except Exception as e:
            print(f"❌ Error: {str(e)[:100]}")
            break
    
    print(f"\n✅ Total items fetched: {len(all_items)}\n")
    return all_items

def similarity_ratio(str1, str2):
    """Calculate similarity ratio between two strings"""
    return SequenceMatcher(None, str1.lower(), str2.lower()).ratio()

def normalize_name(name):
    """Normalize task name for comparison"""
    # Remove common prefixes/suffixes
    name = name.lower().strip()
    
    # Remove trailing punctuation
    name = name.rstrip('.')
    
    # Remove common prefixes
    prefixes = ['bug:', 'feature:', 'task:', 'todo:']
    for prefix in prefixes:
        if name.startswith(prefix):
            name = name[len(prefix):].strip()
    
    return name

def find_duplicates(items):
    """Find duplicate or very similar tasks"""
    duplicates = []
    checked = set()
    
    print("Analyzing for duplicates...")
    print(f"Checking {len(items)} items...\n")
    
    for i, item1 in enumerate(items):
        if item1["id"] in checked:
            continue
        
        name1 = normalize_name(item1["name"])
        similar_items = [item1]
        
        for j, item2 in enumerate(items[i+1:], start=i+1):
            if item2["id"] in checked:
                continue
            
            name2 = normalize_name(item2["name"])
            
            # Check for exact match
            if name1 == name2:
                similar_items.append(item2)
                checked.add(item2["id"])
                continue
            
            # Check for high similarity (>85%)
            ratio = similarity_ratio(name1, name2)
            if ratio > 0.85:
                similar_items.append(item2)
                checked.add(item2["id"])
        
        if len(similar_items) > 1:
            duplicates.append(similar_items)
            checked.add(item1["id"])
    
    return duplicates

def extract_column_value(item, column_id):
    """Extract column value from item"""
    columns = item.get("column_values", [])
    for col in columns:
        if col.get("id") == column_id:
            value = col.get("value")
            if value:
                try:
                    # Try to parse as JSON
                    parsed = json.loads(value)
                    # Handle different column types
                    if isinstance(parsed, dict):
                        if "label" in parsed:
                            return parsed["label"]
                        elif "text" in parsed:
                            return parsed["text"]
                    return value
                except:
                    return value
            return None
    return None

def print_duplicate_report(duplicates, items_map):
    """Print detailed report of duplicates"""
    print("="*80)
    print(f"DUPLICATE ANALYSIS REPORT")
    print("="*80)
    print(f"\nFound {len(duplicates)} groups of duplicate/similar tasks\n")
    
    total_items_to_merge = sum(len(group) for group in duplicates)
    items_to_keep = len(duplicates)
    items_to_delete = total_items_to_merge - items_to_keep
    
    print(f"📊 Summary:")
    print(f"   Total duplicate items: {total_items_to_merge}")
    print(f"   Items to keep (after merge): {items_to_keep}")
    print(f"   Items to delete: {items_to_delete}")
    print()
    
    for idx, group in enumerate(duplicates, 1):
        print(f"\n{'='*80}")
        print(f"DUPLICATE GROUP #{idx}")
        print(f"{'='*80}")
        
        for i, item in enumerate(group):
            print(f"\n[Item {i+1}] ID: {item['id']}")
            print(f"Name: {item['name']}")
            print(f"Created: {item.get('created_at', 'N/A')}")
            print(f"Updated: {item.get('updated_at', 'N/A')}")
            
            # Extract key column values
            notes = extract_column_value(item, "long_text_mkybrj92")
            effort = extract_column_value(item, "numeric_mkybvp")
            cost = extract_column_value(item, "numeric_mkyb1hgh")
            priority = extract_column_value(item, "color_mkybc1he")
            status = extract_column_value(item, "color_mkybqz3t")
            
            if notes:
                print(f"Notes: {notes[:100]}..." if len(notes) > 100 else f"Notes: {notes}")
            if effort:
                print(f"Effort: {effort} hours")
            if cost:
                print(f"Cost: ${cost}")
            if priority:
                print(f"Priority: {priority}")
            if status:
                print(f"Status: {status}")
        
        print(f"\n{'='*80}")
        print(f"RECOMMENDATION:")
        print(f"  Keep: Item 1 (ID: {group[0]['id']})")
        print(f"  Merge notes/attributes from other items")
        print(f"  Delete: Items 2-{len(group)} ({', '.join(item['id'] for item in group[1:])})")
        print(f"{'='*80}")
    
    return items_to_delete

def save_duplicate_report(duplicates, filename="/home/ubuntu/duplicate_report.json"):
    """Save duplicate report to JSON file"""
    report = {
        "total_groups": len(duplicates),
        "total_items": sum(len(group) for group in duplicates),
        "items_to_keep": len(duplicates),
        "items_to_delete": sum(len(group) for group in duplicates) - len(duplicates),
        "groups": []
    }
    
    for group in duplicates:
        group_data = {
            "keep_item_id": group[0]["id"],
            "keep_item_name": group[0]["name"],
            "delete_item_ids": [item["id"] for item in group[1:]],
            "all_items": [
                {
                    "id": item["id"],
                    "name": item["name"],
                    "created_at": item.get("created_at"),
                    "updated_at": item.get("updated_at")
                }
                for item in group
            ]
        }
        report["groups"].append(group_data)
    
    with open(filename, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n✅ Duplicate report saved to: {filename}")
    return filename

def main():
    """Main function"""
    # Fetch all items
    items = fetch_all_items()
    
    if not items:
        print("❌ No items found or error fetching items")
        return 1
    
    # Find duplicates
    duplicates = find_duplicates(items)
    
    if not duplicates:
        print("✅ No duplicates found! Board is clean.")
        return 0
    
    # Create items map for quick lookup
    items_map = {item["id"]: item for item in items}
    
    # Print report
    items_to_delete = print_duplicate_report(duplicates, items_map)
    
    # Save report
    report_file = save_duplicate_report(duplicates)
    
    print(f"\n{'='*80}")
    print(f"NEXT STEPS:")
    print(f"{'='*80}")
    print(f"1. Review the duplicate report above")
    print(f"2. Confirm which items to keep and which to delete")
    print(f"3. Run the merge script to consolidate duplicates")
    print(f"4. Estimated cleanup: Delete {items_to_delete} duplicate items")
    print(f"{'='*80}\n")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
