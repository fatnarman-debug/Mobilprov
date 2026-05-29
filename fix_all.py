import os

files_to_fix = [
    'src/app/(student)/ovning/page.tsx',
    'src/app/(student)/ovning/flashcards/page.tsx',
    'src/app/(student)/topic/[id]/TopicClient.tsx',
    'src/app/(student)/practice/PracticeClient.tsx',
    'src/app/(student)/test/TestClient.tsx',
    'src/app/(student)/analysis/AnalysisClient.tsx'
]

for filepath in files_to_fix:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        content = f.read()

    # If it has `return ( <header`, make it `return ( <> <header`
    # If it has `return ( <main`, make it `return ( <> <main`
    # Replace the last `);` or `</div>\n  );\n}` with `</>\n  );\n}`

    if 'return ( <>' not in content:
        content = content.replace('return ( <header', 'return ( <>\n      <header')
        content = content.replace('return ( <main', 'return ( <>\n      <main')
        content = content.replace('return ( <div', 'return ( <>\n      <div')
    
    # Remove any extra `</div>` at the very end before `);` if we already have `<main>` closed
    # Actually, the safest way to fix the end is:
    # find the last `  );`
    # change whatever is right before it to `</>` if we opened `<>`.
    
    parts = content.rsplit('  );\n}', 1)
    if len(parts) == 2:
        # Check if the file had a dangling `</div>` that we need to remove or replace
        lines = parts[0].split('\n')
        if lines[-1].strip() == '</div>' or lines[-1].strip() == '</div>\n':
            lines.pop()
        
        # Add `</>` at the end of parts[0]
        new_content = '\n'.join(lines) + '\n    </>\n  );\n}'
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

