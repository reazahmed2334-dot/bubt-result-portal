const recordedMarks = courses.filter(
  course =>
    course.midterm !== null &&
    course.midterm !== undefined &&
    course.midterm !== '' &&
    course.midterm_status !== 'absent' &&
    course.midterm_status !== 'not_on_sheet'
).length;
