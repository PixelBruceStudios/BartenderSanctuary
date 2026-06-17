#!/usr/bin/env python3
import re

path = '/home/skicmi/bartender-sanctuary-app/data/school.ts'
with open(path, 'r') as f:
    text = f.read()

# Update interfaces first
text = text.replace(
    "export interface Lesson {\n  id: string;\n  title: string;\n  description: string;\n  duration: string;\n  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';\n  content: string;\n  sources?: string[];\n  completed?: boolean;\n}\n",
    "export interface Lesson {\n  id: string;\n  title: string;\n  description: string;\n  duration: string;\n  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';\n  content: string;\n  sources?: string[];\n  completed?: boolean;\n  sort_order: number;\n}\n"
)

text = text.replace(
    "export interface Technique {\n  slug: string;\n  title: string;\n  description: string;\n  lessons: Lesson[];\n}\n",
    "export interface Technique {\n  id: string;\n  slug: string;\n  title: string;\n  description: string;\n  sort_order: number;\n  lessons: Lesson[];\n}\n"
)

text = text.replace(
    "export interface Category {\n  slug: string;\n  title: string;\n  description: string;\n  icon: string;\n  techniques: Technique[];\n}\n",
    "export interface Category {\n  id: string;\n  slug: string;\n  title: string;\n  description: string;\n  icon: string;\n  sort_order: number;\n  techniques: Technique[];\n}\n"
)

# Now add id and sort_order to objects using brace-depth tracking
# We'll process line by line

lines = text.split('\n')
out = []
i = 0

while i < len(lines):
    line = lines[i]
    
    # Detect opening braces for category, technique, or lesson
    if line.strip() == '{':
        indent = len(line) - len(line.lstrip())
        
        # Look ahead to determine what type of object this is
        if i + 1 < len(lines):
            next_line = lines[i + 1]
            next_stripped = next_line.strip()
            
            # Category: 2-space indent, next line has slug
            if indent == 2 and next_stripped.startswith("slug: '") and 'techniques:' in '\n'.join(lines[i:i+10]):
                slug_m = re.search(r"slug: '([^']+)'", next_stripped)
                slug = slug_m.group(1) if slug_m else ''
                out.append(line)
                if slug:
                    out.append(f"    id: '{slug}',")
                i += 1
                continue
            
            # Technique: 6-space indent, next line has slug
            elif indent == 6 and next_stripped.startswith("slug: '") and 'lessons:' in '\n'.join(lines[i:i+10]):
                slug_m = re.search(r"slug: '([^']+)'", next_stripped)
                slug = slug_m.group(1) if slug_m else ''
                out.append(line)
                if slug:
                    out.append(f"        id: '{slug}',")
                i += 1
                continue
            
            # Lesson: 10-space indent, next line has id
            elif indent == 10 and next_stripped.startswith("id: '") and 'duration:' in '\n'.join(lines[i:i+10]):
                out.append(line)
                i += 1
                continue
    
    # Detect closing braces and add sort_order before them
    if line.strip() == '}':
        indent = len(line) - len(line.lstrip())
        
        # Lesson close: 10-space indent (but actually 8 spaces for the closing })
        if indent == 8:
            # Check if we just closed a lesson by looking at what came before
            prev = '\n'.join(out[-5:])
            if 'duration:' in prev or 'content:' in prev:
                out.append('          sort_order: 0,')
        
        # Technique close: 6-space indent
        elif indent == 6:
            prev = '\n'.join(out[-5:])
            if 'lessons:' in prev or 'sort_order: 0,' in prev:
                out.append('      sort_order: 0,')
        
        # Category close: 2-space indent
        elif indent == 2:
            prev = '\n'.join(out[-5:])
            if 'techniques:' in prev or 'sort_order: 0,' in prev:
                out.append('    sort_order: 0,')
    
    out.append(line)
    i += 1

# Join and fix any double commas
result = '\n'.join(out)
result = result.replace(',\n,', ',')

with open(path, 'w') as f:
    f.write(result)

print("Done")
