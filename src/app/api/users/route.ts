import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const users = await sql`
      SELECT u.*, s.name as current_sector_name, s.color as sector_color
      FROM users_app u
      LEFT JOIN sectors s ON u.sector_id = s.id
      ORDER BY u.name ASC
    `;
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, sector_id, sector_name, role, avatar_url } = body;

    if (!name) {
      return NextResponse.json({ error: 'Nome do usuário é obrigatório' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO users_app (name, email, sector_id, sector_name, role, avatar_url)
      VALUES (${name}, ${email || null}, ${sector_id || null}, ${sector_name || null}, ${role || null}, ${avatar_url || null})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, email, sector_id, sector_name, role, avatar_url } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'ID e Nome são obrigatórios' }, { status: 400 });
    }

    const result = await sql`
      UPDATE users_app
      SET name = ${name}, email = ${email || null}, sector_id = ${sector_id || null}, sector_name = ${sector_name || null}, role = ${role || null}, avatar_url = ${avatar_url || null}
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Error updating user:', error);
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

    await sql`DELETE FROM users_app WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
