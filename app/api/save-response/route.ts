import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accepted, chosenPlanId, chosenPlanTitle, movieChoice, suggestions } = body;

    // Get user agent and IP
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Save to Supabase
    const { data, error } = await supabase
      .from('responses')
      .insert([
        {
          accepted,
          chosen_plan_id: chosenPlanId,
          chosen_plan_title: chosenPlanTitle,
          movie_choice: movieChoice,
          suggestions,
          user_agent: userAgent,
          ip_address: ipAddress,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save response' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error saving response:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
