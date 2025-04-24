export interface LessonItem {
    id: string;
    name: string;
    duration: string | undefined | null;
    isWatched: boolean;
}

export interface LessonPageModule {
    id: string;
    name: string;
    lessons: LessonItem[];
}

export interface LessonData {
    id: string;
    courseName: string;
    name: string;
    moduleName: string;
    videoUrl: string;
    nextLessonId: string;
    instructorName: string;
    lessonsWatched: number;
    lessonsTotal: number;
    progress: number;
    duration: string;
    longDescription: string;
    isWatched: boolean;
    modules: LessonPageModule[];
}
