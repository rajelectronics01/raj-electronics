import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        const uploadDir = join(process.cwd(), 'public', 'uploads');
        
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore if directory already exists
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Clean filename and add timestamp to avoid collisions
            const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
            const filename = `${Date.now()}-${originalName}`;
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            uploadedUrls.push(`/uploads/${filename}`);
        }

        return NextResponse.json({ urls: uploadedUrls });
    } catch (error: any) {
        console.error('File upload failed:', error);
        return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
    }
}
