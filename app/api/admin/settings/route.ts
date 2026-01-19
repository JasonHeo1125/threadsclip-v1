import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const SETTING_KEY_DEFAULT_LIMIT = 'DEFAULT_STORAGE_LIMIT';

export async function GET(request: Request) {
  try {
    const adminKey = request.headers.get('x-admin-key');
    console.log('[Admin Settings] Key check:', adminKey ? 'Present' : 'Missing');
    
    if (adminKey !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const setting = await prisma.systemSettings.findUnique({
      where: { key: SETTING_KEY_DEFAULT_LIMIT }
    });

    return NextResponse.json({ 
      defaultValue: setting?.value ? parseInt(setting.value) : 1000 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { defaultValue } = await request.json();

    const setting = await prisma.systemSettings.upsert({
      where: { key: SETTING_KEY_DEFAULT_LIMIT },
      update: { value: defaultValue.toString() },
      create: { 
        key: SETTING_KEY_DEFAULT_LIMIT, 
        value: defaultValue.toString(),
        description: 'Default storage limit for new users'
      }
    });

    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
