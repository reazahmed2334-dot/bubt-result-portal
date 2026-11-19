
export async function POST(request) {
  try {
    const { studentId } = await request.json();

    if (!studentId || !studentId.trim()) {
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

    // Step 1: Find the student
    const studentParams = new URLSearchParams({
      select: "id,student_id,full_name,intake,section,program",
      student_id: `eq.${studentId.trim()}`,
      limit: "1",
    });

    const studentResponse = await fetch(
      `${supabaseUrl}/rest/v1/students?${studentParams}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    );

    if (!studentResponse.ok) {
      throw new Error("Student lookup failed.");
    }

    const students = await studentResponse.json();

    if (students.length === 0) {
      return Response.json(
        { error: "Student ID not found." },
        { status: 404 }
      );
    }

    const student = students[0];

    // Step 2: Find published semester results
    const resultParams = new URLSearchParams({
      select: "id,semester,cgpa,status,published_at",
      student_id: `eq.${student.id}`,
      status: "eq.published",
      order: "created_at.desc",
    });

    const resultResponse = await fetch(
      `${supabaseUrl}/rest/v1/semester_results?${resultParams}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    );

    if (!resultResponse.ok) {
      throw new Error("Result lookup failed.");
    }

    const results = await resultResponse.json();

    // Step 3: Find course marks for each result
    const resultsWithCourses = [];

    for (const result of results) {
      const courseParams = new URLSearchParams({
        select:
          "course_code,course_title,class_test,midterm,midterm_status,final_exam,total,letter_grade",
        result_id: `eq.${result.id}`,
        order: "course_code.asc",
      });

      const courseResponse = await fetch(
        `${supabaseUrl}/rest/v1/course_marks?${courseParams}`,
        {
          method: "GET",
          headers,
          cache: "no-store",
        }
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

    // Step 4: Return student information and results
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
