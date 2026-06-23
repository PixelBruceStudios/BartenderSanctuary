with open('.env', 'r') as f:
    lines = f.readlines()

with open('/tmp/neon_pass.txt') as f:
    password = f.read().strip()

for i, line in enumerate(lines):
    if line.startswith('DATABASE_URL='):
        # Extract parts around the password placeholder
        # Format: DATABASE_URL="postgresql://neondb_owner:***@rest..."
        prefix = 'postgresql://neondb_owner:'
        suffix_start = line.find('@')
        if suffix_start != -1:
            suffix = line[suffix_start:]  # from @ to end
            # Remove trailing newline from suffix, keep it for the line
            new_line = f'DATABASE_URL="{prefix}{password}{suffix}'
            if not new_line.endswith('\n'):
                new_line += '\n'
            lines[i] = new_line
            print(f'Fixed line {i}')
            break

with open('.env', 'w') as f:
    f.writelines(lines)
