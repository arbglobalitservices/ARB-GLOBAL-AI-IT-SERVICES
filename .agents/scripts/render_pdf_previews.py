from pathlib import Path
import fitz

INPUT_DIR = Path("attached_assets")
OUTPUT_DIR = Path(".agents/outputs/pdf-previews")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

for pdf_path in sorted(INPUT_DIR.glob("*.pdf")):
    document = fitz.open(pdf_path)
    page = document[0]
    pixmap = page.get_pixmap(matrix=fitz.Matrix(1.4, 1.4), alpha=False)
    output_path = OUTPUT_DIR / f"{pdf_path.stem}-page-1.png"
    pixmap.save(output_path)
    print(f"{pdf_path.name}\tpages={document.page_count}\tpreview={output_path}")
    document.close()