import re

with open('src/app/(student)/dashboard/page.tsx', 'r') as f:
    content = f.read()

# 1. Remove Maintenance Guard
maint_guard = r'// Maintenance Guard\s*if\s*\(isMaintenance\s*&&\s*!isAdmin\)\s*\{.*?return\s*\(.*?</div>\s*\);\s*\}'
content = re.sub(maint_guard, '', content, flags=re.DOTALL)

# 2. Remove TopAppBar
top_bar = r'\{/\* TopAppBar \*/\}\s*<header className="fixed top-0.*?</header>'
content = re.sub(top_bar, '', content, flags=re.DOTALL)

# 3. Remove BottomNav
bottom_nav = r'<BottomNav[^>]*/>'
content = re.sub(bottom_nav, '', content)

# 4. Remove wrapping padding and bg classes from main container, because layout handles it.
content = content.replace('<div className="bg-background text-on-background font-body-md min-h-screen pb-32">', '')
content = content.replace('className="mt-16 px-gutter pt-md max-w-container-max mx-auto space-y-lg"', 'className="px-4 md:px-8 pt-6 lg:pt-10 max-w-[1600px] w-full mx-auto space-y-8"')

# Remove the closing div for the wrapper we just removed
content = content.rsplit('</div>', 1)
content = "".join(content)

# Upgrade the CSS for UI/UX Pro Max in Dashboard
content = content.replace('bg-gradient-to-br from-surface-container-lowest to-surface-container-low/50 border border-outline-variant/30 rounded-3xl p-md shadow-sm hover:shadow-md transition-all duration-300', 'bg-gradient-to-br from-white to-surface-container-lowest dark:from-surface-container-low/50 dark:to-background border border-outline-variant/50 rounded-[2rem] p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500')
content = content.replace('bg-surface-container-lowest p-md rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:border-primary/20 hover:scale-[1.01] transition-all duration-300', 'bg-white dark:bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-primary/30 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 group')
content = content.replace('w-12 h-12 rounded-2xl', 'w-14 h-14 rounded-2xl shadow-sm')

with open('src/app/(student)/dashboard/page.tsx', 'w') as f:
    f.write(content)

