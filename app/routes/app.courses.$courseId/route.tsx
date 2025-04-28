import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { API_BASE_URL } from "~/api/config";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import CfHlsPlayer from "~/components/ui/video-player";
import { fetchWithAuth } from "~/lib/api.server";
import UnauthorizedError from "~/utils/unauthorized-error";
import pic from "~/assets/foto-alan.png";

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

        console.log(courseData.modules[0].lessons[0])

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
                <CfHlsPlayer
                    src={"https://customer-wv32dkya9y6lk9k0.cloudflarestream.com/13c9b1710ee9494c9a67d736a4703215/manifest/video.m3u8"}
                    poster="https://customer-wv32dkya9y6lk9k0.cloudflarestream.com/13c9b1710ee9494c9a67d736a4703215/thumbnails/thumbnail.jpg?time=&height=600" />
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
                        className="mt-4 md:mt-0 bg-principal text-white text-sm px-4 py-2 rounded-md flex items-center"
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
                        <OverviewComp />
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
                        <img alt="lesson-thumbnail" src={lesson.thumbnailUrl} className="w-48 h-28 flex-shrink-0 rounded-lg object-cover" />

                        <div className="flex-grow flex flex-col justify-between py-2 pl-3 pr-12">
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
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${lesson.isWatched ? "bg-[#13A08E]" : "bg-[#CDCDCD]"
                                }`}>
                                <Check color="#FFFFFF" className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}

const OverviewComp = () => {
    return (
        <div className="bg-gray-100 p-6 md:p-10 rounded-lg max-w-4xl mx-auto">
            <div className="text-center mb-4">
                <p className="text-gray-700 text-lg">Bienvenido a:</p>
                <h1 className="text-4xl md:text-5xl font-bold text-[#3d4e81] mt-2">The Art of Reset</h1>
            </div>

            <div className="mt-12 flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3">
                    <div className="rounded-lg overflow-hidden">
                        <img
                            src={pic}
                            alt="CEO portrait"
                            width={300}
                            height={300}
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                </div>

                <div className="md:w-2/3 space-y-4">
                    <p className="text-gray-800 text-lg">
                        "Con este sistema volverás al mercado con una nueva versión de ti.
                        <br />
                        Más claro, y caro 😊. Más posicionado. Más valioso.
                        <br />
                        Cada nivel que desbloquees te acerca a un posicionamiento más alto.
                        <br />
                        Yo te voy a guiar paso a paso.
                        <br />
                        Lo único que te pido: <span className="font-bold">Hazlo en orden. No saltes nada</span>".
                    </p>

                    <p className="text-gray-500 pt-4">Alan Pinargote | CEO at The Art of Reset</p>
                </div>
            </div>
        </div>
    );
}