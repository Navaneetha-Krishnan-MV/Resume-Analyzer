


pdf_data = extract_pdf_content(
    "/home/navan/Personal/RESUMES/Navaneethakrishnan M V.pdf"
)

print(pdf_data["text"])
print("\nLinks:", pdf_data["links"])