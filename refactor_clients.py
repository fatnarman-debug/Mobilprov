import re
import glob

# The pattern for TopAppBar
top_bar = r'\{/\* TopAppBar \*/\}\s*<header className="fixed top-0.*?</header>'

# The pattern for BottomNav
bottom_nav = r'<BottomNav[^>]*/>'

# The pattern for Maintenance Guard (some might have it if they did client-side checks, but usually it's in page.tsx)
# Wait, page.tsx has maintenance guard. We should remove it from `page.tsx` files too!
maint_guard = r'// Maintenance Guard\s*if\s*\(isMaintenance\s*&&\s*!isAdmin\)\s*\{.*?return\s*\(.*?</div>\s*\);\s*\}'

# The pattern for layout wrapper
# Most pages have: `<div className="bg-background text-on-background font-body-md min-h-screen pb-32">` or similar
wrapper_start = r'<div className="bg-background text-on-background[^>]*>'
# Replace it with `<div className="w-full flex-1">` or just remove it if we remove the closing div.
# Let's just remove the first <div> and the last </div>.
# Wait, it's safer to just change the className of the top <div> to `className="w-full h-full"`
# Let's see what happens.

for filepath in glob.glob('src/app/(student)/**/*.tsx', recursive=True):
    if filepath.endswith('layout.tsx'):
        continue

    with open(filepath, 'r') as f:
        content = f.read()

    orig_content = content

    if '{/* TopAppBar */}' in content:
        content = re.sub(top_bar, '', content, flags=re.DOTALL)
    
    if '<BottomNav' in content:
        content = re.sub(bottom_nav, '', content)

    if 'import BottomNav' in content:
        content = re.sub(r'import BottomNav from [^\n]*\n', '', content)
    
    if '// Maintenance Guard' in content:
        content = re.sub(maint_guard, '', content, flags=re.DOTALL)

    # Let's just replace the wrapping div padding:
    content = content.replace('min-h-screen pb-32', 'pb-4')
    content = content.replace('min-h-screen pb-20', 'pb-4')
    content = content.replace('pt-20 px-gutter', 'pt-6 px-4 md:px-8 max-w-[1600px] mx-auto w-full')
    content = content.replace('mt-16 px-gutter pt-md', 'pt-6 px-4 md:px-8 max-w-[1600px] mx-auto w-full')
    content = content.replace('mt-16 pt-base px-gutter', 'pt-6 px-4 md:px-8 max-w-[1600px] mx-auto w-full')
    content = content.replace('mt-16 px-gutter', 'pt-6 px-4 md:px-8 max-w-[1600px] mx-auto w-full')

    # UI/UX Pro Max Upgrades for cards
    content = content.replace('bg-surface-container-lowest p-md rounded-2xl border border-outline-variant/30 shadow-sm', 'bg-white dark:bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm hover:shadow-md transition-all duration-300')
    content = content.replace('bg-surface-container-lowest p-base rounded-2xl shadow-sm border border-outline-variant/30', 'bg-white dark:bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/40 hover:shadow-md transition-all duration-300')

    if content != orig_content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Refactored {filepath}")

