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

    # Find the dangling `</div>` just before `</>\n  );`
    # Replace `    </div>\n\n    </>\n  );` with `    </>\n  );`
    # Also handle variations with whitespace
    
    import re
    # We want to remove the LAST </div> before `</>`
    # We can just do string replace for `</div>\n\n    </>\n  )` 
    content = re.sub(r'</div>\s*</>\s*\)', '</>\n  )', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Fixed {filepath}")

