import puppeteer from 'puppeteer';
import PDFDocument from 'pdfkit';
import { extractTopWords } from './utils'; 
import { Response } from 'express';

export async function generatePdfFromUrl(url: string, res: Response) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });
    const text = await page.$eval('body', (el) => el.innerText);
    
    const topWords = extractTopWords(text, 10);

    const doc = new PDFDocument();
    const buffers: Uint8Array[] = [];
    
    doc.on('data', (chunk: Uint8Array) => buffers.push(chunk));
    doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
        res.send(pdfBuffer);
    });

    doc.text('Top 10 longest words from the webpage:');
    topWords.forEach((word, index) => {
        doc.text(`${index + 1}. ${word}`);
    });
    doc.end();

    await browser.close();
}