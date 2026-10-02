import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const sectors = await sql`
      SELECT * FROM sectors ORDER BY name ASC
    `;
    return NextResponse.json(sectors);
  } catch (error: any) {
    console.error('Error fetching sectors:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, code, description, color } = body;

    if (!name) {
      return NextResponse.json({ error: 'Nome do setor é obrigatório' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO sectors (name, code, description, color)
      VALUES (${name}, ${code || null}, ${description || null}, ${color || '#3b82f6'})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating sector:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, code, description, color } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'ID e Nome são obrigatórios' }, { status: 400 });
    }

    const result = await sql`
      UPDATE sectors
      SET name = ${name}, code = ${code || null}, description = ${description || null}, color = ${color || '#3b82f6'}
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Error updating sector:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    await sql`DELETE FROM sectors WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting sector:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
