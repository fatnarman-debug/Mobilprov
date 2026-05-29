import sys
try:
    from pypdf import PdfReader
except ImportError:
    print("pypdf not installed. Please install it first.")
    sys.exit(1)

reader = PdfReader('.agent/brain/scratch/sverige-i-fokus.pdf')
# Extract pages 18 to 23 (indices 17 to 22)
text = ""
for i in range(17, 23):
    if i < len(reader.pages):
        text += f"\n--- PAGE {i+1} ---\n"
        text += reader.pages[i].extract_text()

with open('.agent/brain/scratch/extracted_pages.txt', 'w', encoding='utf-8') as f:
    f.write(text)

print("Text extracted successfully.")
