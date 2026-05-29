import re
import glob

for filepath in glob.glob('src/app/(student)/**/*.tsx', recursive=True):
    if filepath.endswith('layout.tsx'):
        continue

    with open(filepath, 'r') as f:
        content = f.read()

    # Wrap the return content in <> </>
    # Find `return (` and replace with `return ( <>`
    # Replace the last `);` with `</> );`
    # We should be careful to only do this for the main component's return.
    
    # Alternatively, just remove all standalone comments that might be the first element.
    # Like `^\s*\{\/\*.*?\*\/\}\s*<main`
    
    content = re.sub(r'return \(\s*\{\/\*.*?\*\/\}\s*<', 'return ( <', content, flags=re.DOTALL)
    content = re.sub(r'return \(\s*(?:<div[^>]*>\s*)?\{\/\*.*?\*\/\}\s*<', 'return ( <', content, flags=re.DOTALL)
    
    # Just to be 100% safe, any comment before `<main` or `<div` after `return (`:
    content = re.sub(r'return \(\s*\{\/\*.*?\*\/\}\s*', 'return ( ', content)
    content = re.sub(r'\s*\{\/\*.*?\*\/\}\s*(<main)', r' \1', content)

    with open(filepath, 'w') as f:
        f.write(content)
    
