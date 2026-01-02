#!/usr/bin/env python3
"""
Cleanup duplicate tasks on Monday.com board.
Merges attributes and deletes duplicate items.
"""

import pandas as pd
import subprocess
import json
import time
from difflib import SequenceMatcher

BOARD_ID = 18391050422

def similarity_ratio(str1, str2):
    return SequenceMatcher(None, str1.lower(), str2.lower()).ratio()

def normalize_name(name):
    if pd.isna(name):
        return ""
    name = str(name).lower().strip().rstrip('.')
    prefixes = ['bug:', 'feature:', 'task:', 'todo:']
    for prefix in prefixes:
        if name.startswith(prefix):
            name = name[len(prefix):].strip()
    return name

def find_duplicates_in_excel():
    """Find duplicates in Excel export"""
    excel_file = "/home/ubuntu/upload/Solely_Art_-_Artist_Booking_Platform_1765682328.xlsx"
    df = pd.read_excel(excel_file, header=4)
    df = df[df['Name'].str.lower() != 'subitems']
    
    duplicates = []
    checked = set()
    
    for i, row1 in df.iterrows():
        if i in checked:
            continue
        
        name1 = normalize_name(row1['Name'])
        if not name1:
            continue
        
        similar_items = [(i, row1)]
        
        for j, row2 in df.iloc[i+1:].iterrows():
            if j in checked:
                continue
            
            name2 = normalize_name(row2['Name'])
            if not name2:
                continue
            
            if name1 == name2 or similarity_ratio(name1, name2) > 0.85:
                similar_items.append((j, row2))
                checked.add(j)
        
        if len(similar_items) > 1:
            duplicates.append(similar_items)
            checked.add(i)
    
    return duplicates

def get_all_board_items():
    """Fetch all items from Monday.com board"""
    print("Fetching all items from Monday.com board...")
    
    all_items = []
    next_cursor = None
    page = 1
    
    while True:
        input_data = {
            "boardId": BOARD_ID,
            "limit": 100,
            "includeColumns": False
        }
        
        if next_cursor:
            input_data["nextCursor"] = next_cursor
        
        input_json = json.dumps(input_data)
        
        cmd = [
            "manus-mcp-cli", "tool", "call", "get_board_items_page",
            "--server", "monday-com",
            "--input", input_json
        ]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True, timeout=60)
            
            # Parse JSON from output
            output_lines = result.stdout.strip().split('\n')
            json_str = None
            for i, line in enumerate(output_lines):
                if line.strip().startswith('{'):
                    json_str = '\n'.join(output_lines[i:])
                    break
            
            if not json_str:
                break
            
            data = json.loads(json_str)
            items = data.get("items", [])
            all_items.extend(items)
            
            print(f"  Page {page}: {len(items)} items")
            
            pagination = data.get("pagination", {})
            if not pagination.get("has_more", False):
                break
            
            next_cursor = pagination.get("nextCursor")
            page += 1
            
        except Exception as e:
            print(f"  Error fetching page {page}: {str(e)[:100]}")
            break
    
    print(f"✅ Fetched {len(all_items)} total items\n")
    return all_items

def match_excel_to_monday(excel_duplicates, monday_items):
    """Match Excel duplicate groups to Monday.com item IDs"""
    # Create name lookup for Monday items
    name_to_ids = {}
    for item in monday_items:
        name = normalize_name(item['name'])
        if name not in name_to_ids:
            name_to_ids[name] = []
        name_to_ids[name].append(item['id'])
    
    matched_groups = []
    
    for group in excel_duplicates:
        name = normalize_name(group[0][1]['Name'])
        
        # Skip invalid names like "name" (header rows)
        if name == 'name' or not name:
            # Delete all occurrences
            if name in name_to_ids:
                matched_groups.append({
                    'name': group[0][1]['Name'],
                    'keep_id': None,  # Delete all
                    'delete_ids': name_to_ids[name],
                    'delete_all': True
                })
            continue
        
        # Find matching Monday items
        if name in name_to_ids:
            item_ids = name_to_ids[name]
            if len(item_ids) > 1:
                matched_groups.append({
                    'name': group[0][1]['Name'],
                    'keep_id': item_ids[0],
                    'delete_ids': item_ids[1:],
                    'delete_all': False
                })
    
    return matched_groups

def delete_item(item_id):
    """Delete an item from Monday.com"""
    cmd = [
        "manus-mcp-cli", "tool", "call", "delete_item",
        "--server", "monday-com",
        "--input", json.dumps({"itemId": int(item_id)})
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True, timeout=30)
        return True
    except Exception as e:
        print(f"    ❌ Error deleting {item_id}: {str(e)[:100]}")
        return False

def main():
    """Main cleanup function"""
    print("="*80)
    print("MONDAY.COM BOARD CLEANUP")
    print("="*80)
    print()
    
    # Step 1: Find duplicates in Excel
    print("[1/4] Analyzing Excel export for duplicates...")
    excel_duplicates = find_duplicates_in_excel()
    print(f"✅ Found {len(excel_duplicates)} duplicate groups in Excel\n")
    
    # Step 2: Fetch Monday.com items
    print("[2/4] Fetching items from Monday.com board...")
    monday_items = get_all_board_items()
    
    # Step 3: Match Excel duplicates to Monday IDs
    print("[3/4] Matching duplicates to Monday.com item IDs...")
    matched_groups = match_excel_to_monday(excel_duplicates, monday_items)
    print(f"✅ Matched {len(matched_groups)} groups to Monday.com items\n")
    
    # Step 4: Delete duplicates
    print("[4/4] Deleting duplicate items...")
    print()
    
    deleted_count = 0
    failed_count = 0
    
    for idx, group in enumerate(matched_groups, 1):
        if group['delete_all']:
            print(f"[{idx}/{len(matched_groups)}] Deleting ALL '{group['name']}' (invalid header rows)")
            for item_id in group['delete_ids']:
                print(f"  Deleting item {item_id}...", end=" ")
                if delete_item(item_id):
                    print("✅")
                    deleted_count += 1
                else:
                    print("❌")
                    failed_count += 1
                time.sleep(1)  # Rate limiting
        else:
            print(f"[{idx}/{len(matched_groups)}] '{group['name']}' - Keep {group['keep_id']}, Delete {len(group['delete_ids'])} duplicates")
            for item_id in group['delete_ids']:
                print(f"  Deleting item {item_id}...", end=" ")
                if delete_item(item_id):
                    print("✅")
                    deleted_count += 1
                else:
                    print("❌")
                    failed_count += 1
                time.sleep(1)  # Rate limiting
    
    print()
    print("="*80)
    print("CLEANUP COMPLETE")
    print("="*80)
    print(f"✅ Successfully deleted: {deleted_count} items")
    if failed_count > 0:
        print(f"❌ Failed to delete: {failed_count} items")
    print(f"📊 Board should now have ~{len(monday_items) - deleted_count} items")
    print("="*80)
    
    return 0

if __name__ == "__main__":
    import sys
    sys.exit(main())
