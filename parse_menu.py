import re

with open("pos-backend/scripts/seedDatabase.js") as f:
    seed_js = f.read()

seeded_items_lower = {x.lower() for x in set(re.findall(r'name:\s*"([^"]+)"', seed_js))}

with open("menu_text.txt") as f:
    lines = [L.strip() for L in f.readlines() if L.strip()]

extracted_items = []
current_header = "Misc"
for i in range(len(lines)):
    if lines[i].isdigit():
        # Look back for the name
        name_parts = []
        desc = ""
        j = i - 1
        while j >= 0 and not lines[j].isdigit():
            # Usually names are in ALL CAPS
            if lines[j].isupper() or len(lines[j]) > 3: 
                name_parts.insert(0, lines[j])
            j -= 1
        
        if name_parts:
            # Let's just grab the last string as the name, the rest might be category/desc but it's tricky.
            name_raw = " ".join(name_parts[-2:]) if len(name_parts) > 1 else name_parts[0]
            name_raw = " ".join([p for p in name_parts if p != current_header])
            
            # Simple check if some name_part is missing from seed
            # Actually, let's just print names not in seed to a file so I can review them manually
            pass

print(f"Total seeded items: {len(seeded_items_lower)}")
