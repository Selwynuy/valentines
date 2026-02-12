import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all responses from Supabase
    const { data, error } = await supabaseAdmin
      .from('responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch responses' },
        { status: 500 }
      );
    }

    return NextResponse.json({ responses: data || [] });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
