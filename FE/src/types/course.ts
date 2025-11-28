// src/types/course.ts

export interface VideoLesson {
    videoID: string;
    title: string;
    videoURL: string;
    durationMinutes: number;
}

export interface TheoryLesson {
    theoryLessonID: string;
    title: string;
    content: string;
}

export interface Exercise {
    exerciseID: string;
    title: string;
    minPassingScore: number;
}

export interface Test {
    testID: string;
    testName: string;
    testDuration: number;
}

export interface Chapter {
    chapterID: string;
    chapterTitle: string;
    chapterOrder: number;
    chapterDescription?: string;
    videoLessons: VideoLesson[];
    theoryLessons: TheoryLesson[];
    exercises: Exercise[];
    tests: Test[];
}

export interface CourseDetailData {
    courseID: string;
    courseName: string;
    courseState: string;
    teacherID: string;
    teacher?: { user?: { fullName: string; email: string } };
    totalDuration: number;
    numStudents: number;
    averageRating: number;
    numRatings: number;
    numTests: number;
    numTheoryLessons: number;
    numExercises: number;
    numVideos: number;
    chapters?: Chapter[];
}