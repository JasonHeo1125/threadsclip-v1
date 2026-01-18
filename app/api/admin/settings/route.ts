import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

const ADMIN_EMAIL = 'jasonheo1998@gmail.com';
const SETTING_KEY_DEFAULT_LIMIT = 'DEFAULT_STORAGE_LIMIT';

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.email !== ADMIN_EMAIL) {
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
    const session = await auth();
    if (session?.user?.email !== ADMIN_EMAIL) {
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
