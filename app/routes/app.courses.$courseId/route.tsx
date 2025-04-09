import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Check, ChevronDown, ChevronUp, Play } from "lucide-react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { Button } from "~/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Course, getCourse } from "~/services/course.service";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { courseId } = params;

    invariant(courseId, "Missing course Id");

    const course = await getCourse(courseId);
    if (!course) throw new Error("Course not found");

    return { course };
};

export default function CoursePage() {

    const { course } = useLoaderData<{ course: Course }>();
    const [preparacionOpen, setPreparacionOpen] = useState(false);
    const [introduccionOpen, setIntroduccionOpen] = useState(false);

    return (
        <div>
            {/* Video Player */}
            <div className="w-screen h-[80vh] relative mb-6 rounded-b-xl overflow-hidden bg-gradient-to-r from-indigo-900 to-purple-900">
                
                <iframe
                    title="Course Video"
                    src="https://customer-wv32dkya9y6lk9k0.cloudflarestream.com/13c9b1710ee9494c9a67d736a4703215/iframe?muted=true&preload=true&loop=true&autoplay=true&poster=https%3A%2F%2Fcustomer-wv32dkya9y6lk9k0.cloudflarestream.com%2F13c9b1710ee9494c9a67d736a4703215%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600&controls=false"
                    loading="lazy"
                    className="absolute top-0 left-0 h-full w-full"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen={true}
                ></iframe>
                {/*
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={"https://customer-wv32dkya9y6lk9k0.cloudflarestream.com/13c9b1710ee9494c9a67d736a4703215/iframe?muted=true&preload=true&loop=true&autoplay=true&poster=https%3A%2F%2Fcustomer-wv32dkya9y6lk9k0.cloudflarestream.com%2F13c9b1710ee9494c9a67d736a4703215%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600&controls=false"} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                */}
            </div>

            <main className="max-w-4xl mx-auto p-4">
                {/* Course Info */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="w-full md:w-auto md:flex-shrink-0">
                        <div className="w-48 h-24 rounded-lg overflow-hidden bg-gradient-to-r from-indigo-900 to-purple-900">
                            <div className="w-full h-full flex items-center justify-center">
                                <Play className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                            <div>
                                <h1 className="text-xl font-bold">{course.title}</h1>
                                <p className="text-sm text-gray-600">{course.instructor}</p>
                            </div>
                            <Button className="mt-2 md:mt-0 bg-indigo-600 hover:bg-indigo-700">
                                <span>Continue lesson</span>
                            </Button>
                        </div>
                        <Progress value={course.progress.percentage} className="h-2 mb-1" />
                        <div className="text-xs text-right text-gray-600">
                            {course.progress.completed}/{course.progress.total} Completed
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="mb-8">
                    <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="lessons">Lessons</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <div>Overview</div>
                    </TabsContent>
                    <TabsContent value="lessons">
                        {/* Course Sections */}
                        <div className="space-y-4">
                            {course.sections.map((section) => {
                                const isPrep = section.id === "preparacion" ? preparacionOpen : introduccionOpen
                                return (
                                    <Collapsible
                                        key={section.id}
                                        open={section.id === "preparacion" ? preparacionOpen : introduccionOpen}
                                        onOpenChange={section.id === "preparacion" ? setPreparacionOpen : setIntroduccionOpen}
                                        className="border-b pb-4"
                                    >
                                        <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                                            <h2 className="text-lg font-semibold">{section.title}</h2>
                                            {

                                                (isPrep) ? (
                                                    <ChevronUp className="h-5 w-5" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5" />
                                                )}
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="space-y-4 mt-4">
                                            {section.lessons.map((lesson) => (
                                                <div key={lesson.id} className="flex gap-4">
                                                    <div className="w-48 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-r from-pink-500 to-indigo-600"></div>
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h3 className="font-medium">{lesson.number}. {lesson.title}</h3>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-gray-600">{lesson.duration}</span>

                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-1">{lesson.description}</p>
                                                        <p className="text-xs text-gray-500">Lesson tutor: {lesson.instructor}</p>
                                                    </div>

                                                    <div className="mx-2 flex items-center justify-center">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${lesson.status === "completed" ? "bg-green-100" : "bg-gray-100"
                                                            }`}>
                                                            <Check className={`w-4 h-4 ${lesson.status === "completed" ? "text-green-600" : "text-gray-400"
                                                                }`} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </CollapsibleContent>
                                    </Collapsible>
                                );
                            })}
                        </div>
                    </TabsContent>
                </Tabs>


            </main>
        </div>
    );
}