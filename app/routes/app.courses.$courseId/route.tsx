import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Check, ChevronDown, ChevronUp, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { API_BASE_URL } from "~/api/config";
import { Button } from "~/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { fetchWithAuth } from "~/lib/api.server";

interface LessonData {
    lessonId: string;
    thumbnailUrl?: string;
    name?: string;
    description?: string;
    duration?: string;
    isWatched: boolean;
    globalIdx?: number;
}

interface ModuleData {
    moduleId?: string;
    moduleTitle?: string;
    lessons: LessonData[];
}
interface CourseData {
    bannerUrl?: string;
    courseName?: string;
    courseAuthor?: string;
    currentLessonId?: string;
    totalLessons: number;
    watchedLessons: string;
    modules: ModuleData[];
    percentage?: number;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { courseId } = params;

    invariant(courseId, "Missing course Id");

    try {
        const courseData = (await fetchWithAuth(`${API_BASE_URL}/courses/user/${courseId}`, request)) as CourseData;

        if (!courseData) throw new Error("Course not found");

        return { courseData };
    } catch (error: unknown) {
        if (error instanceof UnauthorizedError)
            return redirect("/logout");
    }
    return null;
};

export default function CoursePage() {

    const { courseData } = useLoaderData<{ courseData: CourseData }>();

    return (
        <div>
            <div className="mb-6 h-[80vh] rounded-b-3xl object-cover">

                {/*<iframe
                    title="Course Video"
                    src={courseData.bannerUrl}
                    loading="lazy"
                    className="h-full w-full rounded-b-[2rem] object-cover"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen={false}
                ></iframe> */}

                <CfHlsPlayer src={"https://customer-wv32dkya9y6lk9k0.cloudflarestream.com/13c9b1710ee9494c9a67d736a4703215/manifest/video.m3u8"} />
            </div>

            <main className="max-w-4xl mx-auto p-4">
                {/* Course Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                        <h1 className="text-lg font-bold">Bienvenido a {courseData.courseName}</h1>
                        <p className="text-sm text-gray-600">{courseData.courseAuthor}</p>
                    </div>
                    <Link
                        to={`/app/lessons/${courseData.currentLessonId}`}
                        className="mt-4 md:mt-0 bg-[#2d3748] text-white text-sm px-4 py-2 rounded-md flex items-center"
                    >
                        <span className="mr-1">+</span> Continuar lección
                    </Link>
                </div>

                <div className="flex items-center mt-6">
                    <Progress value={courseData.percentage} className="h-2" />

                    <div className="flex justify-end min-w-[250px] items-center">
                        <span className="text-xs text-gray-600 text-center">
                            {courseData.watchedLessons}/{courseData.totalLessons} Completadas
                        </span>
                    </div>
                </div>

                <Tabs defaultValue="lessons" className="mb-8 mt-[5rem]">
                    <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                        <TabsTrigger value="overview">Descripcion</TabsTrigger>
                        <TabsTrigger value="lessons">Lecciones</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <div>Overview</div>
                    </TabsContent>
                    <TabsContent value="lessons">
                        {/* Course Sections */}
                        <div className="space-y-4">
                            {courseData.modules.map((module: ModuleData) => {
                                return (
                                    <Module
                                        key={module.moduleId}
                                        instructor={courseData.courseAuthor!}
                                        module={module} />
                                );
                            })}
                        </div>
                    </TabsContent>
                </Tabs>


            </main>
        </div>
    );
}

interface ModuleProps {
    module: ModuleData;
    instructor: string;
}

const Module = ({ module, instructor }: ModuleProps) => {

    const [isOpen, setIsOpen] = useState(true);

    return (
        <Collapsible
            key={module.moduleId}
            open={isOpen}
            onOpenChange={() => setIsOpen((prev) => !prev)}
            className="border-b pb-4"
        >
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                <h2 className="text-lg font-semibold">{module.moduleTitle}</h2>
                {

                    (isOpen) ? (
                        <ChevronUp className="h-5 w-5" />
                    ) : (
                        <ChevronDown className="h-5 w-5" />
                    )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 mt-4">
                {module.lessons.map((lesson) => (
                    <Link key={lesson.lessonId} to={`/app/lessons/${lesson.lessonId}`} className="flex">   
                        <img alt="lesson-thumbnail" src={lesson.thumbnailUrl} className="w-48 h-28 flex-shrink-0 rounded-lg object-cover"/>
                        
                        <div className="flex-grow flex flex-col justify-between py-2 px-3">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-medium">{lesson.globalIdx}. {lesson.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">{lesson.duration}</span>

                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{lesson.description}</p>
                            <p className="text-xs text-gray-500">Instructor: <span className="text-[#2d3748]">{instructor}</span></p>
                        </div>

                        <div className="mx-2 flex items-center justify-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${lesson.isWatched ? "bg-[##13A08E]" : "bg-[#CDCDCD]"
                                }`}>
                                <Check className={`w-4 h-4 text-[#DEE7E6]}`} />
                            </div>
                        </div>
                    </Link>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}



import Hls from "hls.js";
import UnauthorizedError from "~/utils/unauthorized-error";

function CfHlsPlayer({ src }: Readonly<{ src?: string }>) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (!src) return;

        // Native HLS support (Safari, iOS)
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        } else if (Hls.isSupported()) {
            // hls.js fallback
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            return () => {
                hls.destroy();
            };
        } else {
            console.error("This browser does not support HLS");
        }
    }, [src]);

    return (
        <video
            ref={videoRef}
            className="w-full h-full object-cover mx-auto aspect-video rounded-b-[3rem] shadow-lg bg-black"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="https://customer-wv32dkya9y6lk9k0.cloudflarestream.com/13c9b1710ee9494c9a67d736a4703215/thumbnails/thumbnail.jpg?time=&height=600"
        >
            <p>Your browser doesn’t support HTML5 video.</p>
        </video>
    );
}