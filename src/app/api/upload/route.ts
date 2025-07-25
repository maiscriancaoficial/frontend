import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou PDF.' },
        { status: 400 }
      );
    }

    // Validar tamanho (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Verificar se Vercel Blob está configurado
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Fallback para desenvolvimento local
      try {
        const { writeFile, mkdir } = await import('fs/promises');
        const { join } = await import('path');
        const { existsSync } = await import('fs');
        
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'produtos');
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }

        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = file.name.split('.').pop();
        const fileName = `${timestamp}-${randomString}.${extension}`;
        const filePath = join(uploadDir, fileName);

        await writeFile(filePath, buffer);
        const publicUrl = `/uploads/produtos/${fileName}`;

        return NextResponse.json({
          success: true,
          url: publicUrl,
          message: 'Arquivo enviado com sucesso (local)'
        });
      } catch (error) {
        console.error('Erro no upload local:', error);
        return NextResponse.json(
          { error: 'Erro no upload local. Configure o Vercel Blob para produção.' },
          { status: 500 }
        );
      }
    }

    try {
      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop();
      const fileName = `produtos/${timestamp}-${randomString}.${extension}`;

      // Upload para Vercel Blob
      const blob = await put(fileName, buffer, {
        access: 'public',
        contentType: file.type,
      });
      
      return NextResponse.json({
        success: true,
        url: blob.url,
        message: 'Arquivo enviado com sucesso para Vercel Blob'
      });

    } catch (blobError) {
      console.error('Erro no Vercel Blob:', blobError);
      return NextResponse.json(
        { error: 'Erro no upload para Vercel Blob' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
