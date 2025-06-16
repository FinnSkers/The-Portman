import os

def extract_text_from_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.txt':
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    elif ext == '.pdf':
        try:
            import PyPDF2
            with open(file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                return '\n'.join(page.extract_text() or '' for page in reader.pages)
        except ImportError:
            return ''
    elif ext == '.docx':
        try:
            import docx
            doc = docx.Document(file_path)
            return '\n'.join([para.text for para in doc.paragraphs])
        except ImportError:
            return ''
    else:
        return ''
