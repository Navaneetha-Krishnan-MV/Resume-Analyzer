import fitz  # PyMuPDF
from pymupdf4llm import to_markdown
import re


def extract_pdf_content(file_path):
    doc = fitz.open(file_path)

    # Layout-aware extraction
    md_text = to_markdown(doc)

    return md_text

pdf_data = extract_pdf_content(
    "/home/navan/Personal/RESUMES/Navaneethakrishnan M V.pdf"
)

print("Text snippet:\n")
print(pdf_data)