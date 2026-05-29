import re

for filepath in ['src/app/(student)/ovning/page.tsx', 'src/app/(student)/ovning/flashcards/page.tsx']:
    with open(filepath, 'r') as f:
        content = f.read()

    content = content.replace('return ( <header', 'return ( <>\n      <header')
    content = content.replace('return ( <main', 'return ( <>\n      <main')
    
    parts = content.rsplit('  )\n}', 1)
    if len(parts) == 2:
        lines = parts[0].split('\n')
        if lines[-1].strip() == '</div>' or lines[-1].strip() == '</div>\n':
            lines.pop()
        
        new_content = '\n'.join(lines) + '\n    </>\n  )\n}'
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")
    else:
        print(f"Failed to split {filepath}")

