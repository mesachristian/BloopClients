import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { BookOpen } from "lucide-react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { API_BASE_URL } from "~/api/config";
import LessonList from "~/components/lessons/lesson-list";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { fetchWithAuth } from "~/lib/api.server";
import { LessonData } from "~/models/lessons/lesson-page-dto";
import UnauthorizedError from "~/utils/unauthorized-error";

import fs from "fs"

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const { lessonId } = params;
    invariant(lessonId, "Missing lesson Id")

    try {
        const lessonData = (await fetchWithAuth(`${API_BASE_URL}/lessons/${lessonId}`, request)) as LessonData;

        if (!lessonData) throw new Error("Lesson not found");

        return { lessonData };
    } catch (error: unknown) {
        if (error instanceof UnauthorizedError)
            return redirect("/logout");
    }

    return null;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
    try {
        const { lessonId } = params;
        invariant(lessonId, "Lesson id not send");

        await fetchWithAuth(`${API_BASE_URL}/lessons/${lessonId}/mark-as-viewed`, request, {
            method: 'POST'
        });
    } catch (error: unknown) {
        if (error instanceof UnauthorizedError)
            return redirect("/logout");
    }

    return null;
}

export default function LessonPage() {
    const iFrameRef = useRef<HTMLIFrameElement>(null);

    const notionIframeRef = useRef<HTMLIFrameElement>(null);

    const { lessonData } = useLoaderData<{ lessonData: LessonData }>();

    const fetcher = useFetcher();

    useEffect(() => {
        const player = (window as any).Stream(document.getElementById('stream-player'));
        player.addEventListener('ended', () => {
            if (!lessonData.isWatched)
                fetcher.submit(
                    { lessonId: lessonData.id },
                    { method: 'post' }
                );
        });

        return () => {
            player.removeEventListener('ended', () => { });
        };
    }, [iFrameRef]);

    // Scroll notion i frame height
    useEffect(() => {
        console.log("SCROLLS")
        const iframe = notionIframeRef.current;
        if (!iframe) return;

        // A function that measures the iframe’s content and applies that height
        const resizeIframe = () => {
            try {
                const doc = iframe.contentWindow?.document;
                if (doc) {
                    // Use whichever is more accurate for your HTML (body vs. documentElement)
                    const height = doc.documentElement.scrollHeight || doc.body.scrollHeight;
                    iframe.style.height = height + "px";
                }
            } catch (e) {
                // In theory this shouldn’t run here, because srcDoc is same‐origin. 
                console.warn("Couldn’t resize iframe:", e);
            }
        };

        // When the iframe first finishes loading its srcDoc
        iframe.addEventListener("load", resizeIframe);

        // Fire once in case the browser already loaded it before we attached the listener
        // (i.e. React might have written the DOM <iframe> before this effect ran)
        setTimeout(resizeIframe, 0);

        // If lessonData.longDescription changes, we want to re‐run this effect so height is correct
        // (React will re‐mount or update the iframe’s srcDoc below.)
        return () => {
            iframe.removeEventListener("load", resizeIframe);
        };
    }, [lessonData.longDescription]);

    return (
        <div className="flex h-[calc(100vh-70px)]">
            { /* Lesson Content */}
            <div className="flex-1 flex flex-col h-[calc(100vh-70px)] overflow-hidden">
                <div className="flex-1 overflow-auto">
                    <div className="max-w-4xl mx-auto p-6 space-y-6">
                        <div className="flex space-x-2">
                            <BookOpen />
                            <h2 className="font-bold">{lessonData.courseName}</h2>
                        </div>

                        <div>
                            <div className="text-sm text-muted-foreground">Módulo de Bienvenida</div>
                            <h1 className="text-2xl font-bold mt-0">Bienvenido a The Art Of Reset</h1>
                        </div>

                        { /* Video Container */}
                        <div className="overflow-hidden">
                            <iframe
                                id="stream-player"
                                ref={iFrameRef}
                                title="Lesson Video"
                                src={lessonData.videoUrl || "https://customer-wv32dkya9y6lk9k0.cloudflarestream.com/13c9b1710ee9494c9a67d736a4703215/iframe"}
                                className="relative aspect-video mb-6 rounded-xl overflow-hidden border-0 w-full"
                                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                allowFullScreen={true}
                            ></iframe>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                <div>
                                    <h1 className="text-lg font-bold">{lessonData.name}</h1>
                                    <p className="text-sm text-gray-600">{lessonData.instructorName}</p>
                                </div>
                                <Link
                                    to={`/app/lessons/${lessonData.nextLessonId}`}
                                    className="mt-4 md:mt-0 bg-[#2d3748] text-white text-sm px-4 py-2 rounded-md flex items-center"
                                >
                                    <span className="mr-1">+</span> Continuar lección
                                </Link>
                            </div>

                            <div className="flex items-center mt-6">
                                <Progress value={100 * lessonData.lessonsWatched / lessonData.lessonsTotal} indicatorColor="" className="h-2" />

                                <div className="flex justify-end min-w-[250px] items-center">
                                    <span className="text-xs text-gray-600 text-center">
                                        {lessonData.lessonsWatched}/{lessonData.lessonsTotal} Completadas
                                    </span>
                                </div>
                            </div>
                        </div>

                        { /* Description */}
                        <iframe
                            ref={notionIframeRef}
                            sandbox="allow-same-origin"
                            srcDoc={lessonData.longDescription}
                            scrolling="no"
                            style={{
                                width: "100%",
                                minHeight: "100%"
                            }}
                            title="Notion Preview"
                        />
                    </div>
                </div>
            </div>

            { /* Rigth sidebar */}
            <div className="w-[400px] border-l h-[calc(100vh-70px)] flex flex-col">
                <Tabs defaultValue="lessons" className="flex-1 flex flex-col h-full">
                    <TabsList className="grid grid-cols-2 mx-2 mt-4">
                        <TabsTrigger value="lessons">Lessons</TabsTrigger>
                        <TabsTrigger value="feed">Feed</TabsTrigger>
                    </TabsList>
                    <TabsContent value="lessons" className="flex-1 flex flex-col overflow-hidden">
                        <LessonList currentLessonId={lessonData.id} modules={lessonData.modules} progress={lessonData.progress} />
                    </TabsContent>
                    <TabsContent value="feed" className="p-4 flex-1 overflow-auto">
                        <div className="space-y-4">
                            <h3 className="font-medium">Recent Updates</h3>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">No recent updates</p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}