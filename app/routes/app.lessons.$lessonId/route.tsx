import { LoaderFunctionArgs } from "@remix-run/node";
import { Book, Check, ChevronRight, Clock, LinkIcon, MessageSquare, Send, Smile } from "lucide-react";
import invariant from "tiny-invariant";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { lessonId } = params;
    invariant(lessonId, "Missing lesson Id")

    ///const lesson = await getLesson(lessonId);

    return { lessonId };
};

export default function LessonPage() {



    return (
        <div className="bg-white h-full">
            {/* Main Content */}
            <div className="pr-96 overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-end p-4">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <span className="font-medium text-indigo-600">Supercerebro</span>
                            <span className="mx-2 text-gray-500 text-sm">Intro 2 - Prepárate para el desafío...</span>
                        </div>
                        <div className="w-10 h-6 rounded overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">2/5</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 pb-8">
                    <h1 className="text-2xl font-bold mb-6">Bienvenido a Price Action Academy</h1>

                    {/* Video Player */}

                    <iframe
                        title="Lesson Video"
                        src={`https://customer-wv32dkya9y6lk9k0.cloudflarestream.com/13c9b1710ee9494c9a67d736a4703215/iframe`}
                        className="relative aspect-video mb-6 rounded-xl overflow-hidden border-0 w-full"
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen={true}
                    ></iframe>


                    {/* Course Info */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h2 className="text-xl font-bold">Bienvenido a Price Action Academy</h2>
                                <p className="text-sm text-gray-600">Felipe Lopez</p>
                            </div>
                            <Button className="bg-indigo-600 hover:bg-indigo-700">
                                <ChevronRight className="w-4 h-4 mr-2" />
                                Continue lesson
                            </Button>
                        </div>
                        <Progress value={53} className="h-2 mb-1" />
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>18/34 Completed</span>
                            <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>5 mins</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Cultivando tu Disciplina es un curso de finanzas y trading enfocado en fortalecer tu mentalidad y mejorar
                            tu toma de decisiones. Aprenderás a gestionar riesgos, controlar emociones y operar con disciplina,
                            desarrollando hábitos que te permitan mantener la calma y la consistencia a largo plazo. A lo largo del
                            curso, te enseñaremos a seguir una estrategia clara y efectiva, evitando decisiones impulsivas y
                            maximizando tus oportunidades para lograr un éxito sostenido en los mercados.

                            Cultivando tu Disciplina es un curso de finanzas y trading enfocado en fortalecer tu mentalidad y mejorar
                            tu toma de decisiones. Aprenderás a gestionar riesgos, controlar emociones y operar con disciplina,
                            desarrollando hábitos que te permitan mantener la calma y la consistencia a largo plazo. A lo largo del
                            curso, te enseñaremos a seguir una estrategia clara y efectiva, evitando decisiones impulsivas y
                            maximizando tus oportunidades para lograr un éxito sostenido en los mercados.

                            Cultivando tu Disciplina es un curso de finanzas y trading enfocado en fortalecer tu mentalidad y mejorar
                            tu toma de decisiones. Aprenderás a gestionar riesgos, controlar emociones y operar con disciplina,
                            desarrollando hábitos que te permitan mantener la calma y la consistencia a largo plazo. A lo largo del
                            curso, te enseñaremos a seguir una estrategia clara y efectiva, evitando decisiones impulsivas y
                            maximizando tus oportunidades para lograr un éxito sostenido en los mercados.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-96 fixed top-[70px] right-0 h-[calc(100vh-70px)] z-10 border-l flex flex-col">
                {/* Sidebar Header */}
                <div className="border-b h-full">
                    <Tabs defaultValue="lessons" className="h-full">
                        <TabsList className="w-full grid grid-cols-2">
                            <TabsTrigger value="feed" className="data-[state=active]:text-indigo-600">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Feed
                            </TabsTrigger>
                            <TabsTrigger value="lessons" className="data-[state=active]:text-indigo-600">
                                <Book className="w-4 h-4 mr-2" />
                                Lessons
                            </TabsTrigger>
                        </TabsList>

                        {/* Feed Content */}
                        <TabsContent value="feed" className="h-[calc(100%-48px)]">
                            <div className="flex flex-col h-full">
                                <div className="flex-1 overflow-auto p-4">
                                    {/* Chat Messages */}
                                    <div className="space-y-6">
                                        {/* Message 1 */}
                                        <div className="flex gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                                <AvatarFallback>JD</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="text-sm">
                                                    <span className="font-medium">Hey team 👋 need to prioritize the API docs portal. </span>
                                                    <span className="text-indigo-600">@Solomon</span>
                                                    <span> where are we with the endpoint documentation?</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* More messages... */}
                                        <div className="flex gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="John" />
                                                <AvatarFallback>J</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">John</span>
                                                    <span className="text-xs text-gray-500">12:11 AM</span>
                                                </div>
                                                <div className="text-sm mt-1">I can help. Already documented payment API errors.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t mt-auto">
                                    <div className="relative">
                                        <Input placeholder="Write your message..." className="pr-20 pl-4 py-6" />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                <LinkIcon className="h-4 w-4 text-gray-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                <Smile className="h-4 w-4 text-gray-500" />
                                            </Button>
                                            <Button size="icon" className="h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700">
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Lessons Content */}
                        <TabsContent value="lessons">
                            <div className="flex flex-col overflow-y-auto">
                                {/* Section 1 */}
                                <div className="p-4 pb-2">
                                    <h3 className="text-lg font-semibold">Preparación Intensa</h3>
                                    <p className="text-sm text-gray-500">5/5 completed</p>
                                </div>

                                {/* Lesson 1 */}
                                <div className="flex items-center p-4 hover:bg-gray-50">
                                    <div className="flex-1">
                                        <h4 className="font-medium">Intro 1 - Bienvenido al Desafío de Superrcerebro</h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>5 mins</span>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>

                                {/* Lesson 2 - Current lesson with blue indicator */}
                                <div className="flex items-center p-4 hover:bg-gray-50 relative bg-indigo-50/50">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
                                    <div className="flex-1 pl-2">
                                        <h4 className="font-medium">Intro 2 - Prepárate para el Desafío</h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>5 mins</span>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>

                                {/* Lesson 3 */}
                                <div className="flex items-center p-4 hover:bg-gray-50">
                                    <div className="flex-1">
                                        <h4 className="font-medium">Intro 1 - Bienvenido al Desafío de Superrcerebro</h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>5 mins</span>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>

                                {/* Lesson 1 */}
                                <div className="flex items-center p-4 hover:bg-gray-50">
                                    <div className="flex-1">
                                        <h4 className="font-medium">Intro 1 - Bienvenido al Desafío de Superrcerebro</h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>5 mins</span>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>

                                {/* Lesson 2 - Current lesson with blue indicator */}
                                <div className="flex items-center p-4 hover:bg-gray-50 relative bg-indigo-50/50">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
                                    <div className="flex-1 pl-2">
                                        <h4 className="font-medium">Intro 2 - Prepárate para el Desafío</h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>5 mins</span>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>

                                {/* Lesson 3 */}
                                <div className="flex items-center p-4 hover:bg-gray-50">
                                    <div className="flex-1">
                                        <h4 className="font-medium">Intro 1 - Bienvenido al Desafío de Superrcerebro</h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>5 mins</span>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>{/* Lesson 1 */}
                                <div className="flex items-center p-4 hover:bg-gray-50">
                                    <div className="flex-1">
                                        <h4 className="font-medium">Intro 1 - Bienvenido al Desafío de Superrcerebro</h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>5 mins</span>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>

                                {/* Lesson 2 - Current lesson with blue indicator */}
                                <div className="flex items-center p-4 hover:bg-gray-50 relative bg-indigo-50/50">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
                                    <div className="flex-1 pl-2">
                                        <h4 className="font-medium">Intro 2 - Prepárate para el Desafío</h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>5 mins</span>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>

                                {/* Lesson 3 */}
                                <div className="flex items-center p-4 hover:bg-gray-50">
                                    <div className="flex-1">
                                        <h4 className="font-medium">Intro 1 - Bienvenido al Desafío de Superrcerebro</h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>5 mins</span>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>

                                {/* Section 2 */}
                                <div className="p-4 pb-2 pt-6 border-t">
                                    <h3 className="text-lg font-semibold">Semana 1 - Introducción</h3>
                                    <p className="text-sm text-gray-500">5/5 completed</p>
                                </div>

                                {/* Lesson 6 */}
                                <div className="flex items-center p-4 hover:bg-gray-50">
                                    <div className="flex-1">
                                        <h4 className="font-medium">Intro 1 - Bienvenido al Desafío de Superrcerebro</h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>5 mins</span>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>

                                {/* Lesson 7 */}
                                <div className="flex items-center p-4 hover:bg-gray-50">
                                    <div className="flex-1">
                                        <h4 className="font-medium">Intro 1 - Bienvenido al Desafío de Superrcerebro</h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>5 mins</span>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}