#!/usr/bin/env python3
import re, sys
from pathlib import Path

path = Path('/home/skicmi/bartender-sanctuary-app/data/school.ts')
text = path.read_text(encoding='utf-8')

pattern = re.compile(
    r'\{\s*id:\s*\'([^\']+)\',\s*title:\s*\'([^\']+)\',\s*description:\s*\'[^\']*\',\s*duration:\s*\'[^\']*\',\s*difficulty:\s*\'[^\']*\',\s*content:\s*`([^`]*)`,\s*sources:\s*\[([^\]]*)\]',
    re.DOTALL
)

lessons = []
for m in pattern.finditer(text):
    lessons.append({
        'id': m.group(1),
        'title': m.group(2),
        'content': m.group(3),
        'sources_raw': m.group(4),
        'start': m.start(),
        'end': m.end(),
    })

if not lessons:
    print('NO_LESSONS_FOUND')
    sys.exit(1)

# Pick thinnest content first
lessons.sort(key=lambda x: len(x['content']))
choice = lessons[0]
print(f"{choice['id']}|{choice['title']}")
