#!/usr/bin/env python3
"""
Analyze Excel export from Monday.com to find duplicate tasks.
"""

import pandas as pd
import json
from difflib import SequenceMatcher
import sys

def similarity_ratio(str1, str2):
    """Calculate similarity ratio between two strings"""
    return SequenceMatcher(None, str1.lower(), str2.lower()).ratio()

def normalize_name(name):
    """Normalize task name for comparison"""
    if pd.isna(name):
        return ""
    name = str(name).lower().strip()
    name = name.rstrip('.')
    prefixes = ['bug:', 'feature:', 'task:', 'todo:']
    for prefix in prefixes:
        if name.startswith(prefix):
            name = name[len(prefix):].strip()
    return name

def find_duplicates(df):
    """Find duplicate or very similar tasks"""
    duplicates = []
    checked = set()
    
    print(f"Analyzing {len(df)} tasks for duplicates...\n")
    
    for i, row1 in df.iterrows():
        if i in checked:
            continue
        
        name1 = normalize_name(row1['Name'])
        if not name1:
            continue
        
        similar_items = [row1.to_dict()]
        similar_indices = [i]
        
        for j, row2 in df.iloc[i+1:].iterrows():
            if j in checked:
                continue
            
            name2 = normalize_name(row2['Name'])
            if not name2:
                continue
            
            # Check for exact match
            if name1 == name2:
                similar_items.append(row2.to_dict())
                similar_indices.append(j)
                checked.add(j)
                continue
            
            # Check for high similarity (>85%)
            ratio = similarity_ratio(name1, name2)
            if ratio > 0.85:
                similar_items.append(row2.to_dict())
                similar_indices.append(j)
                checked.add(j)
        
        if len(similar_items) > 1:
            duplicates.append({
                'items': similar_items,
                'indices': similar_indices
            })
            checked.add(i)
    
    return duplicates

def print_duplicate_report(duplicates):
    """Print detailed report of duplicates"""
    print("="*80)
    print(f"DUPLICATE ANALYSIS REPORT")
    print("="*80)
    print(f"\nFound {len(duplicates)} groups of duplicate/similar tasks\n")
    
    total_items_to_merge = sum(len(group['items']) for group in duplicates)
    items_to_keep = len(duplicates)
    items_to_delete = total_items_to_merge - items_to_keep
    
    print(f"📊 Summary:")
    print(f"   Total duplicate items: {total_items_to_merge}")
    print(f"   Items to keep (after merge): {items_to_keep}")
    print(f"   Items to delete: {items_to_delete}")
    print()
    
    merge_actions = []
    
    for idx, group in enumerate(duplicates, 1):
        print(f"\n{'='*80}")
        print(f"DUPLICATE GROUP #{idx}")
        print(f"{'='*80}")
        
        items = group['items']
        
        for i, item in enumerate(items):
            print(f"\n[Item {i+1}]")
            print(f"Name: {item.get('Name', 'N/A')}")
            
            # Show key fields
            if not pd.isna(item.get('Notes')):
                notes = str(item['Notes'])
                print(f"Notes: {notes[:150]}..." if len(notes) > 150 else f"Notes: {notes}")
            
            if not pd.isna(item.get('Effort (Hours)')):
                print(f"Effort: {item['Effort (Hours)']} hours")
            
            if not pd.isna(item.get('Estimated Cost')):
                print(f"Cost: ${item['Estimated Cost']}")
            
            if not pd.isna(item.get('Priority')):
                print(f"Priority: {item['Priority']}")
            
            if not pd.isna(item.get('Status')):
                print(f"Status: {item['Status']}")
            
            if not pd.isna(item.get('Phase')):
                print(f"Phase: {item['Phase']}")
        
        # Recommendation
        print(f"\n{'='*80}")
        print(f"RECOMMENDATION:")
        print(f"  Keep: Item 1 - {items[0].get('Name')}")
        
        # Merge strategy
        merged_notes = []
        merged_effort = 0
        merged_cost = 0
        priorities = []
        
        for item in items:
            if not pd.isna(item.get('Notes')):
                note = str(item['Notes']).strip()
                if note and note not in merged_notes:
                    merged_notes.append(note)
            
            if not pd.isna(item.get('Effort (Hours)')):
                try:
                    merged_effort = max(merged_effort, float(item['Effort (Hours)']))
                except:
                    pass
            
            if not pd.isna(item.get('Estimated Cost')):
                try:
                    merged_cost = max(merged_cost, float(item['Estimated Cost']))
                except:
                    pass
            
            if not pd.isna(item.get('Priority')):
                priorities.append(str(item['Priority']))
        
        print(f"\n  Merged attributes:")
        if merged_notes:
            combined_notes = " | ".join(merged_notes)
            print(f"    Notes: {combined_notes[:200]}..." if len(combined_notes) > 200 else f"    Notes: {combined_notes}")
        if merged_effort > 0:
            print(f"    Effort: {merged_effort} hours (max from all items)")
        if merged_cost > 0:
            print(f"    Cost: ${merged_cost} (max from all items)")
        if priorities:
            priority_order = ['Critical', 'High', 'Medium', 'Low']
            best_priority = min(priorities, key=lambda p: priority_order.index(p) if p in priority_order else 999)
            print(f"    Priority: {best_priority} (highest from all items)")
        
        print(f"\n  Delete: Items 2-{len(items)} (duplicate entries)")
        print(f"{'='*80}")
        
        # Store merge action
        merge_actions.append({
            'keep_name': items[0].get('Name'),
            'delete_count': len(items) - 1,
            'merged_notes': " | ".join(merged_notes) if merged_notes else None,
            'merged_effort': merged_effort if merged_effort > 0 else None,
            'merged_cost': merged_cost if merged_cost > 0 else None,
            'merged_priority': best_priority if priorities else None
        })
    
    # Save merge actions
    with open('/home/ubuntu/merge_actions.json', 'w') as f:
        json.dump(merge_actions, f, indent=2)
    
    print(f"\n✅ Merge actions saved to: /home/ubuntu/merge_actions.json")
    
    return items_to_delete

def main():
    """Main function"""
    excel_file = "/home/ubuntu/upload/Solely_Art_-_Artist_Booking_Platform_1765682328.xlsx"
    
    print(f"Reading Excel file: {excel_file}\n")
    
    try:
        df = pd.read_excel(excel_file)
        print(f"✅ Loaded {len(df)} rows\n")
        
        # Show columns
        print(f"Columns: {', '.join(df.columns)}\n")
        
        # Find duplicates
        duplicates = find_duplicates(df)
        
        if not duplicates:
            print("✅ No duplicates found! Board is clean.")
            return 0
        
        # Print report
        items_to_delete = print_duplicate_report(duplicates)
        
        print(f"\n{'='*80}")
        print(f"NEXT STEPS:")
        print(f"{'='*80}")
        print(f"1. Review the duplicate groups above")
        print(f"2. Confirm merge strategy for each group")
        print(f"3. Use Monday.com MCP tools to:")
        print(f"   - Update Item 1 with merged attributes")
        print(f"   - Delete duplicate items (Items 2-N)")
        print(f"4. Estimated cleanup: Delete {items_to_delete} duplicate items")
        print(f"{'='*80}\n")
        
        return 0
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())
