import io
import json
import os
import re
import shutil
import smtplib
import subprocess
import tempfile
import zipfile
from difflib import SequenceMatcher
from email.message import EmailMessage
from pathlib import Path
from typing import List, Optional

import fitz
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pdf2docx import Converter
from PIL import Image, ImageOps
from pypdf import PdfReader, PdfWriter
from reportlab.lib import pagesizes
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="All-in-One Tools Backend")

_cors_origins_env = os.getenv('CORS_ORIGINS', '*')
_cors_origins = ['*'] if _cors_origins_env == '*' else [origin.strip() for origin in _cors_origins_env.split(',')]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 20 * 1024 * 1024
MAX_FILES = 10


@app.get('/health')
def health_check():
    return {'status': 'ok'}


def _validate_upload(upload: UploadFile, allowed_types: set[str], allowed_extensions: tuple[str, ...]) -> None:
    if upload.filename is None:
        raise HTTPException(status_code=400, detail='The uploaded file is missing a name.')

    if upload.content_type not in allowed_types and upload.content_type not in {'application/octet-stream'}:
        raise HTTPException(status_code=400, detail=f'Unsupported file type for {upload.filename}.')

    extension = Path(upload.filename).suffix.lower()
    if extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f'File must have one of these extensions: {", ".join(allowed_extensions)}.')


async def _save_upload(upload: UploadFile, tmp_dir: Path, suffix: str) -> Path:
    file_path = tmp_dir / f"{Path(upload.filename or 'upload').stem}{suffix}"
    total_size = 0
    with file_path.open('wb') as destination:
        while True:
            chunk = await upload.read(1024 * 1024)
            if not chunk:
                break
            total_size += len(chunk)
            if total_size > MAX_FILE_SIZE:
                raise HTTPException(status_code=413, detail='File exceeds the maximum allowed size.')
            destination.write(chunk)
    return file_path


async def _save_uploaded_files(uploads: List[UploadFile], suffix: str, allowed_types: set[str], allowed_extensions: tuple[str, ...], tmp_dir: Path) -> List[Path]:
    if len(uploads) > MAX_FILES:
        raise HTTPException(status_code=400, detail=f'You can upload up to {MAX_FILES} files at once.')

    saved_paths = []
    for upload in uploads:
        _validate_upload(upload, allowed_types, allowed_extensions)
        saved_paths.append(await _save_upload(upload, tmp_dir, suffix))
    return saved_paths


async def _extract_text_from_upload(upload: Optional[UploadFile], tmp_dir: Path) -> Optional[str]:
    if upload is None:
        return None
    if upload.filename is None:
        return None
    path = await _save_upload(upload, tmp_dir, '.txt')
    content = path.read_text(encoding='utf-8', errors='ignore')
    return content.strip() or None


@app.post('/api/pdf/merge')
async def merge_pdfs(files: List[UploadFile] = File(...), order: Optional[str] = Form(None)):
    with tempfile.TemporaryDirectory() as tmp_dir_name:
        tmp_dir = Path(tmp_dir_name)
        try:
            saved_files = await _save_uploaded_files(files, '.pdf', {'application/pdf'}, ('.pdf',), tmp_dir)
            if order:
                requested_order = json.loads(order)
                ordered_paths = []
                mapping = {path.name: path for path in saved_files}
                for name in requested_order:
                    if name in mapping:
                        ordered_paths.append(mapping[name])
                if len(ordered_paths) == len(saved_files):
                    saved_files = ordered_paths
            writer = PdfWriter()
            for path in saved_files:
                reader = PdfReader(str(path))
                for page in reader.pages:
                    writer.add_page(page)

            output_bytes = io.BytesIO()
            writer.write(output_bytes)
            output_bytes.seek(0)
            return StreamingResponse(iter([output_bytes.getvalue()]), media_type='application/pdf', headers={'Content-Disposition': 'attachment; filename=merged.pdf'})
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f'Failed to merge PDFs: {exc}') from exc


@app.post('/api/pdf/split')
async def split_pdf(file: UploadFile = File(...), mode: str = Form('ranges'), ranges: str = Form(''), chunk_size: int = Form(2)):
    with tempfile.TemporaryDirectory() as tmp_dir_name:
        tmp_dir = Path(tmp_dir_name)
        try:
            _validate_upload(file, {'application/pdf'}, ('.pdf',))
            input_path = await _save_upload(file, tmp_dir, '.pdf')
            reader = PdfReader(str(input_path))
            if not reader.pages:
                raise HTTPException(status_code=400, detail='The uploaded PDF does not contain any pages.')

            parts = []
            if mode == 'every-n':
                if chunk_size <= 0:
                    raise HTTPException(status_code=400, detail='Chunk size must be greater than zero.')
                start = 0
                while start < len(reader.pages):
                    section = reader.pages[start:start + chunk_size]
                    writer = PdfWriter()
                    for page in section:
                        writer.add_page(page)
                    out = io.BytesIO()
                    writer.write(out)
                    parts.append(out.getvalue())
                    start += chunk_size
            else:
                parsed_ranges = []
                if ranges:
                    for part in ranges.split(','):
                        part = part.strip()
                        if not part:
                            continue
                        if '-' in part:
                            start_text, end_text = part.split('-', 1)
                            start = int(start_text) - 1
                            end = int(end_text)
                        else:
                            start = int(part) - 1
                            end = int(part)
                        parsed_ranges.append((max(0, start), min(len(reader.pages), end)))
                if not parsed_ranges:
                    parsed_ranges = [(0, len(reader.pages))]

                for start, end in parsed_ranges:
                    if start >= end:
                        continue
                    writer = PdfWriter()
                    for page in reader.pages[start:end]:
                        writer.add_page(page)
                    out = io.BytesIO()
                    writer.write(out)
                    parts.append(out.getvalue())

            if not parts:
                raise HTTPException(status_code=400, detail='No output PDFs were generated.')

            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as archive:
                for index, pdf_bytes in enumerate(parts, start=1):
                    archive.writestr(f'part-{index}.pdf', pdf_bytes)
            zip_buffer.seek(0)
            return StreamingResponse(iter([zip_buffer.getvalue()]), media_type='application/zip', headers={'Content-Disposition': 'attachment; filename=split-pdfs.zip'})
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f'Failed to split PDF: {exc}') from exc


@app.post('/api/pdf/compress')
async def compress_pdf(file: UploadFile = File(...)):
    with tempfile.TemporaryDirectory() as tmp_dir_name:
        tmp_dir = Path(tmp_dir_name)
        try:
            _validate_upload(file, {'application/pdf'}, ('.pdf',))
            input_path = await _save_upload(file, tmp_dir, '.pdf')
            doc = fitz.open(str(input_path))
            output_path = tmp_dir / 'compressed.pdf'
            doc.save(output_path, garbage=4, deflate=True, clean=True)
            doc.close()
            output_bytes = output_path.read_bytes()
            return StreamingResponse(iter([output_bytes]), media_type='application/pdf', headers={'Content-Disposition': 'attachment; filename=compressed.pdf'})
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f'Failed to compress PDF: {exc}') from exc


@app.post('/api/pdf/to-word')
async def pdf_to_word(file: UploadFile = File(...)):
    with tempfile.TemporaryDirectory() as tmp_dir_name:
        tmp_dir = Path(tmp_dir_name)
        try:
            _validate_upload(file, {'application/pdf'}, ('.pdf',))
            input_path = await _save_upload(file, tmp_dir, '.pdf')
            output_path = tmp_dir / 'converted.docx'
            cv = Converter(str(input_path))
            cv.convert(str(output_path))
            cv.close()
            output_bytes = output_path.read_bytes()
            return StreamingResponse(iter([output_bytes]), media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document', headers={'Content-Disposition': 'attachment; filename=converted.docx'})
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f'Failed to convert PDF to Word: {exc}') from exc


@app.post('/api/pdf/word-to-pdf')
async def word_to_pdf(file: UploadFile = File(...)):
    with tempfile.TemporaryDirectory() as tmp_dir_name:
        tmp_dir = Path(tmp_dir_name)
        try:
            if not (file.filename or '').lower().endswith('.docx'):
                raise HTTPException(status_code=400, detail='Please upload a .docx file.')
            input_path = await _save_upload(file, tmp_dir, '.docx')
            output_path = tmp_dir / 'converted.pdf'
            libreoffice = shutil.which('libreoffice') or shutil.which('soffice')
            if not libreoffice:
                raise HTTPException(status_code=500, detail='LibreOffice is not available on the server for document conversion.')
            subprocess.run([libreoffice, '--headless', '--convert-to', 'pdf', '--outdir', str(tmp_dir), str(input_path)], check=True, capture_output=True, text=True)
            if not output_path.exists():
                raise HTTPException(status_code=500, detail='LibreOffice did not produce a PDF file.')
            output_bytes = output_path.read_bytes()
            return StreamingResponse(iter([output_bytes]), media_type='application/pdf', headers={'Content-Disposition': 'attachment; filename=converted.pdf'})
        except HTTPException:
            raise
        except subprocess.CalledProcessError as exc:
            raise HTTPException(status_code=500, detail=f'LibreOffice conversion failed: {exc.stderr or exc}') from exc
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f'Failed to convert Word to PDF: {exc}') from exc


@app.post('/api/image/to-pdf')
async def image_to_pdf(files: List[UploadFile] = File(...), page_size: str = Form('a4'), orientation: str = Form('portrait')):
    with tempfile.TemporaryDirectory() as tmp_dir_name:
        tmp_dir = Path(tmp_dir_name)
        try:
            allowed_types = {'image/png', 'image/jpeg', 'image/webp'}
            saved_files = await _save_uploaded_files(files, '.img', allowed_types, ('.png', '.jpg', '.jpeg', '.webp'), tmp_dir)
            output_path = tmp_dir / 'images.pdf'
            pagesize = pagesizes.A4 if page_size.lower() == 'a4' else pagesizes.letter
            if orientation.lower() == 'landscape':
                pagesize = (pagesize[1], pagesize[0])
            c = canvas.Canvas(str(output_path), pagesize=pagesize)
            for image_path in saved_files:
                with Image.open(image_path) as im:
                    im = ImageOps.exif_transpose(im)
                    rgb_im = im.convert('RGB')
                    temp_image = tmp_dir / f'{image_path.stem}-rgb.jpg'
                    rgb_im.save(temp_image)
                    width, height = im.size
                    if orientation.lower() == 'landscape':
                        c.setPageSize((pagesize[1], pagesize[0]))
                    else:
                        c.setPageSize((pagesize[0], pagesize[1]))
                    c.drawImage(str(temp_image), 0.5 * inch, 0.5 * inch, width=width / 2, height=height / 2)
                    c.showPage()
            c.save()
            output_bytes = output_path.read_bytes()
            return StreamingResponse(iter([output_bytes]), media_type='application/pdf', headers={'Content-Disposition': 'attachment; filename=images.pdf'})
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f'Failed to create PDF from images: {exc}') from exc


@app.post('/api/contact')
async def contact_form(name: str = Form(''), email: str = Form(''), message: str = Form('')):
    if not name.strip() or not email.strip() or not message.strip():
        raise HTTPException(status_code=400, detail='Please fill in your name, email, and message.')

    recipient = os.getenv('CONTACT_EMAIL', 'skhsoftwaressolution@gmail.com')
    smtp_host = os.getenv('SMTP_HOST')
    smtp_port = int(os.getenv('SMTP_PORT', '587'))
    smtp_user = os.getenv('SMTP_USER')
    smtp_password = os.getenv('SMTP_PASSWORD')

    if smtp_host and smtp_user and smtp_password:
        email_message = EmailMessage()
        email_message['Subject'] = f'New contact form message from {name}'
        email_message['From'] = smtp_user
        email_message['To'] = recipient
        email_message.set_content(f'Name: {name}\nEmail: {email}\n\nMessage:\n{message}')

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(email_message)
    else:
        print(f'Contact form message from {name} <{email}>: {message}')

    return {'status': 'ok'}


@app.post('/api/text/similarity')
async def document_similarity(text_a: str = Form(''), text_b: str = Form(''), file_a: Optional[UploadFile] = File(None), file_b: Optional[UploadFile] = File(None)):
    with tempfile.TemporaryDirectory() as tmp_dir_name:
        tmp_dir = Path(tmp_dir_name)
        try:
            if not text_a.strip() and file_a is None:
                raise HTTPException(status_code=400, detail='Please provide the first document text or upload a file.')
            if not text_b.strip() and file_b is None:
                raise HTTPException(status_code=400, detail='Please provide the second document text or upload a file.')

            doc_a = text_a.strip() or await _extract_text_from_upload(file_a, tmp_dir) or ''
            doc_b = text_b.strip() or await _extract_text_from_upload(file_b, tmp_dir) or ''
            if not doc_a or not doc_b:
                raise HTTPException(status_code=400, detail='Both documents must contain readable text.')

            vectorizer = TfidfVectorizer(stop_words='english')
            vectors = vectorizer.fit_transform([doc_a, doc_b])
            similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
            overall_percentage = round(float(similarity) * 100, 2)

            sentences_a = [sentence.strip() for sentence in re.split(r'(?<=[.!?])\s+', doc_a) if sentence.strip()]
            sentences_b = [sentence.strip() for sentence in re.split(r'(?<=[.!?])\s+', doc_b) if sentence.strip()]
            matches = []
            for sentence_a in sentences_a[:10]:
                for sentence_b in sentences_b[:10]:
                    score = SequenceMatcher(None, sentence_a.lower(), sentence_b.lower()).ratio()
                    if score >= 0.35:
                        matches.append({'sentence_a': sentence_a, 'sentence_b': sentence_b, 'score': round(score, 2)})
                        break

            return {
                'overall_similarity': overall_percentage,
                'matches': matches[:10],
                'note': 'This compares the two provided documents against each other only. It does not check against the web or any external database.',
            }
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f'Failed to compare documents: {exc}') from exc
