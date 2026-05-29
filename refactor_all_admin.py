import re
import glob

# Pattern to remove TopAppBar and Sidebar and the wrapping div
start_marker = r'<div className="bg-background text-on-surface min-h-screen">\s*{/\* TopAppBar \*/}.*?</aside>\s*{/\* Main Content \*/}\s*<main className="[^"]+">\s*<div className="[^"]+">'
new_start = '<main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto pb-24">'

# Alternate pattern if the div max-w-container is missing or slightly different
start_marker2 = r'<div className="bg-background text-on-surface min-h-screen">\s*{/\* TopAppBar \*/}.*?</aside>\s*{/\* Main Content \*/}\s*<main className="[^"]+">'
new_start2 = '<main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto pb-24">'

end_marker = r'</div>\s*</main>\s*</div>'
new_end = '</main>'

end_marker_with_bottomnav = r'</div>\s*</main>\s*{/\* BottomNavBar \(Mobile Only\) \*/}.*?</nav>\s*</div>'

for filepath in glob.glob('src/app/admin/**/page.tsx', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()

    original_content = content

    if '{/* TopAppBar */}' in content:
        # Try full pattern
        content = re.sub(start_marker, new_start, content, flags=re.DOTALL)
        if content == original_content:
             content = re.sub(start_marker2, new_start2, content, flags=re.DOTALL)

        if '{/* BottomNavBar (Mobile Only) */}' in content:
             content = re.sub(end_marker_with_bottomnav, new_end, content, flags=re.DOTALL)
        else:
             content = re.sub(end_marker, new_end, content, flags=re.DOTALL)

        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Refactored {filepath}")

