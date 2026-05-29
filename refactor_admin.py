import re

with open('src/app/admin/page.tsx', 'r') as f:
    content = f.read()

# 1. Remove TopAppBar and Sidebar and the wrapping div
# Find the start: `<div className="bg-background text-on-surface min-h-screen">`
# Find the end of sidebar: `</aside>`
# Replace everything from the div to `<main ...>` with `<main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto pb-24">`

start_marker = r'<div className="bg-background text-on-surface min-h-screen">\s*{/\* TopAppBar \*/}.*?</aside>\s*{/\* Main Content \*/}\s*<main className="[^"]+">\s*<div className="[^"]+">'
new_start = '<main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto pb-24">'
content = re.sub(start_marker, new_start, content, flags=re.DOTALL)

# 2. Remove the BottomNavBar and closing div at the bottom
end_marker = r'</div>\s*</main>\s*{/\* BottomNavBar \(Mobile Only\) \*/}.*?</nav>\s*</div>'
new_end = '</main>'
content = re.sub(end_marker, new_end, content, flags=re.DOTALL)

# 3. Upgrade UI Classes (Cards)
content = content.replace('className="bg-white p-md rounded-xl border border-outline-variant shadow-sm"', 'className="bg-white/80 dark:bg-surface-container-low/50 backdrop-blur-md p-6 lg:p-8 rounded-3xl border border-outline-variant/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"')
content = content.replace('className="bg-white p-md rounded-xl border border-outline-variant shadow-sm lg:col-span-8 space-y-md"', 'className="bg-white/80 dark:bg-surface-container-low/50 backdrop-blur-md p-6 lg:p-8 rounded-3xl border border-outline-variant/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 lg:col-span-8 space-y-8"')

# 4. Form Inputs
content = content.replace('bg-surface-bright border border-outline-variant rounded-lg p-xs', 'w-full bg-white dark:bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-300')
content = content.replace('bg-surface-bright border border-outline-variant rounded-lg p-md', 'w-full bg-white dark:bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-300')
content = content.replace('bg-surface-bright border border-outline-variant rounded-lg p-sm', 'w-full bg-white dark:bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-300')

# 5. Buttons
content = content.replace('bg-tertiary text-on-tertiary px-lg py-3 rounded-full font-title-md flex items-center gap-base active:scale-95 transition-all', 'bg-tertiary hover:bg-tertiary/90 text-on-tertiary px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:-translate-y-1 shadow-lg shadow-tertiary/30 active:scale-95 transition-all duration-300')
content = content.replace('bg-primary text-on-primary px-lg py-3 rounded-full font-title-md flex items-center gap-base active:scale-95 transition-all', 'bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:-translate-y-1 shadow-lg shadow-primary/30 active:scale-95 transition-all duration-300')
content = content.replace('bg-surface-container-high text-on-surface px-md py-2 rounded-lg font-label-md hover:bg-surface-container-highest transition-colors flex items-center gap-sm w-fit', 'bg-surface-container-high text-on-surface px-4 py-2 rounded-xl text-sm font-semibold hover:bg-surface-container-highest transition-colors flex items-center gap-2 w-fit')
content = content.replace('bg-surface-container-high text-on-surface px-lg py-3 rounded-full font-title-md flex items-center gap-base hover:bg-surface-container-highest transition-all', 'bg-surface-container-high text-on-surface px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:-translate-y-1 shadow-md hover:shadow-lg active:scale-95 transition-all duration-300')

with open('src/app/admin/page.tsx', 'w') as f:
    f.write(content)

