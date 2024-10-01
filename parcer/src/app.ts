import express, { Request, Response } from 'express';
import { generatePdfFromUrl } from './service';

const app = express();
const PORT = 8080;

app.get('/generate-pdf', async (req: Request, res: Response) => {
    const url = req.query.url as string;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        await generatePdfFromUrl(url, res);
    } catch (error) {
        res.status(500).send('Error generating PDF');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
