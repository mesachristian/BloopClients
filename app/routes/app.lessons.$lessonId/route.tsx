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
                                src={`https://customer-wv32dkya9y6lk9k0.cloudflarestream.com/13c9b1710ee9494c9a67d736a4703215/iframe`}
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
                                <Progress value={50} indicatorColor="" className="h-2" />

                                <div className="flex justify-end min-w-[250px] items-center">
                                    <span className="text-xs text-gray-600 text-center">
                                        {lessonData.lessonsWatched}/{lessonData.lessonsTotal} Completadas
                                    </span>
                                </div>
                            </div>
                        </div>

                        { /* Description */}

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                                    1
                                </div>
                                Objetivos
                            </h2>
                            <p className="text-muted-foreground">
                                Este Blueprint está diseñado para ayudar a los estudiantes de RESET a recopilar información clave de los
                                clientes de sus marcas o proyectos. El propósito es entender cómo se percibe la marca externamente, cuáles son
                                los valores más apreciados, y qué productos o servicios generan mayor impacto. Esta encuesta facilitará la
                                extracción de insights profundos que servirán para mejorar la comunicación, optimizar la oferta y fortalecer
                                la conexión con la audiencia.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                                    2
                                </div>
                                Importante
                            </h2>
                            <p className="text-muted-foreground">
                                No todas las marcas estarán dispuestas a realizar la encuesta por sí solas. Siempre ofrece algo a cambio para
                                incentivar la participación. Esto puede ser un descuento, acceso a contenido exclusivo, un sorteo o cualquier
                                beneficio atractivo para la audiencia. Recuerda: las mejores respuestas vienen cuando la persona siente que
                                obtiene valor al participar y cuando la encuesta es breve, clara y fácil de responder.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                                    3
                                </div>
                                Estructura de la Encuesta
                            </h2>
                            <p className="text-muted-foreground">
                                La encuesta está dividida en 5 secciones para obtener una visión completa:
                            </p>
                            <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                                <li>Conexión emocional con la marca</li>
                                <li>Percepción de los valores y personalidad de la marca</li>
                                <li>Análisis de productos y servicios</li>
                                <li>Experiencia de usuario y atención al cliente</li>
                                <li>Expectativas y recomendaciones</li>
                            </ol>
                            <p className="text-muted-foreground">Cada sección incluye preguntas cerradas, abiertas y de valoración.</p>
                        </div>
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