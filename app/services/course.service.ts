import coursesData from '~/data/courses-mock.json';

export type Lesson = {
    id: string;
    number: number;
    title: string;
    description: string;
    duration: string;
    instructor: string;
    status: 'completed' | 'pending';
    thumbnail: string;
};

export type Section = {
    id: string;
    title: string;
    lessons: Lesson[];
};

export type CourseProgress = {
    completed: number;
    total: number;
    percentage: number;
};

export type Course = {
    id: string;
    title: string;
    instructor: string;
    progress: CourseProgress;
    sections: Section[];
};

export async function getCourse(courseId: string): Promise<Course | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const course = coursesData.courses[courseId as keyof typeof coursesData.courses];
    return course || null;
}

export async function getCourseSections(courseId: string): Promise<Section[]> {
    const course = await getCourse(courseId);
    return course?.sections || [];
}

export async function getCourseProgress(courseId: string): Promise<CourseProgress | null> {
    const course = await getCourse(courseId);
    return course?.progress || null;
} 