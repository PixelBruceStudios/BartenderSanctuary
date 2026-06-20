import re

with open('data/ingredients.ts', 'r') as f:
    content = f.read()

# Find all ingredient headers (require category: to distinguish from bottles)
headers = list(re.finditer(r'\{\s*name:\s*"([^"]+)"\s*,\s*category:\s*"([^"]+)"', content))

results = []
for i, m in enumerate(headers):
    name = m.group(1)
    start = m.start()
    end = headers[i+1].start() if i+1 < len(headers) else len(content)
    block = content[start:end]
    
    # Find bottles array in this block
    bottles_match = re.search(r'bottles:\s*\[', block)
    if not bottles_match:
        results.append((name, 0))
        continue
    
    bottles_block = block[bottles_match.end():]
    # Count bottle entries (lines with { name: ... })
    bottles = re.findall(r'\{\s*name:\s*"([^"]+)"', bottles_block)
    results.append((name, len(bottles)))

# Sort by count ASC
results.sort(key=lambda x: x[1])

# Print ingredients with < 5 bottles
for name, count in results:
    if count < 5:
        print(f"{count}|{name}")
