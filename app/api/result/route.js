
export async function POST(request) {
  try {
    const { studentId } = await request.json();

    if (!studentId || !String(studentId).trim()) {
      return Response.json(
        { error: "Please enter your Student ID." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      console.error("Supabase environment variables are missing.");
      return Response.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const headers = {
      apikey: secretKey,
    };

    // Find the student in Intake 64, Section 4
    const studentParams = new URLSearchParams({
      select: "id,student_id,full_name,intake,section,program",
      student_id: `eq.${String(studentId).trim()}`,
      intake: "eq.64",
      section: "eq.4",
      limit: "1",
    });

    const studentResponse = await fetch(
      `${supabaseUrl}/rest/v1/students?${studentParams}`,
      { headers, cache: "no-store" }
    );

    if (!studentResponse.ok) {
      throw new Error("Student lookup failed.");
    }

    const students = await studentResponse.json();

    if (!students.length) {
      return Response.json(
        { error: "Student ID not found." },
        { status: 404 }
      );
    }

    const student = students[0];

    // Retrieve Fall 2026 results, including draft records
    const resultParams = new URLSearchParams({
      select: "id,semester,status",
      student_id: `eq.${student.id}`,
      semester: "eq.Fall 2026",
      order: "created_at.desc",
    });

    const resultResponse = await fetch(
      `${supabaseUrl}/rest/v1/semester_results?${resultParams}`,
      { headers, cache: "no-store" }
    );

    if (!resultResponse.ok) {
      throw new Error("Result lookup failed.");
    }

    const results = await resultResponse.json();

    const resultsWithCourses = [];

    for (const result of results) {
      const courseParams = new URLSearchParams({
        select:
          "course_code,course_title,midterm,midterm_status",
        result_id: `eq.${result.id}`,
        order: "course_code.asc",
      });

      const courseResponse = await fetch(
        `${supabaseUrl}/rest/v1/course_marks?${courseParams}`,
        { headers, cache: "no-store" }
      );

      if (!courseResponse.ok) {
        throw new Error("Course marks lookup failed.");
      }

      const courses = await courseResponse.json();

      resultsWithCourses.push({
        ...result,
        courses,
      });
    }

    return Response.json({
      student,
      results: resultsWithCourses,
    });

  } catch (error) {
    console.error("Result API error:", error);

    return Response.json(
      { error: "Unable to retrieve results. Please try again later." },
      { status: 500 }
    );
  }
}
