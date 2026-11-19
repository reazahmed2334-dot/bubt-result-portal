
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { studentId } = await request.json();

    const id = String(studentId || '').trim();

    if (!/^[A-Za-z0-9-]{3,30}$/.test(id)) {
      return NextResponse.json(
        { error: 'Please enter a valid Student ID.' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      return NextResponse.json(
        { error: 'Server configuration is incomplete.' },
        { status: 500 }
      );
    }

    async function supabaseGet(table, params) {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/${table}?${params}`,
        {
          headers: {
            apikey: secretKey,
            Authorization: `Bearer ${secretKey}`,
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error('Database request failed.');
      }

      return response.json();
    }

    const studentParams = new URLSearchParams({
      select: 'id,student_id,full_name,program,intake,section',
      student_id: `eq.${id}`,
      limit: '1',
    });

    const students = await supabaseGet('students', studentParams);

    if (!students.length) {
      return NextResponse.json(
        { error: 'Student ID not found.' },
        { status: 404 }
      );
    }

    const student = students[0];

    const resultParams = new URLSearchParams({
      select: 'id,semester,cgpa,status,published_at',
      student_id: `eq.${student.id}`,
      status: 'eq.published',
      order: 'created_at.desc',
    });

    const results = await supabaseGet(
      'semester_results',
      resultParams
    );

    if (!results.length) {
      return NextResponse.json(
        { error: 'No published results are available yet.' },
        { status: 404 }
      );
    }

    const finalResults = [];

    for (const result of results) {
      const courseParams = new URLSearchParams({
        select: 'course_code,course_title,class_test,midterm,midterm_status,final_exam,total,letter_grade',,
        result_id: `eq.${result.id}`,
        order: 'course_code.asc',
      });

      const courses = await supabaseGet(
        'course_marks',
        courseParams
      );

      finalResults.push({
        semester: result.semester,
        cgpa: result.cgpa,
        status: result.status,
        publishedAt: result.published_at,
        courses,
      });
    }

    return NextResponse.json({
      student: {
        name: student.full_name,
        studentId: student.student_id,
        program: student.program,
        intake: student.intake,
        section: student.section,
      },
      results: finalResults,
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to retrieve results. Please try again later.' },
      { status: 500 }
    );
  }
}

