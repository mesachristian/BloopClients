import { LessonPageModule } from "~/models/lessons/lesson-page-dto";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent } from "../ui/card";
import { Video } from "lucide-react";
import { Link } from "@remix-run/react";

interface LessonListProps {
    currentLessonId: string;
    progress: number;
    modules: LessonPageModule[];
}

const LessonList = ({ currentLessonId, progress, modules }: LessonListProps) => {
    return (
        <div className="flex flex-col h-full">
            {/* Progress section */}
            <div className="p-4 border-b">
                <h3 className="font-medium mb-2">Progreso</h3>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-right mt-1 text-muted-foreground">{progress}% completado</p>
            </div>

            {/* Scrollable lessons list */}
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-7">
                    {modules.map((module) => (
                        <Card key={module.id} className="w-full max-w-md shadow-none">
                            <CardContent className="space-y-3 px-0">

                                <div className="flex justify-between items-center px-4 py-4 border-b-[1px] border-gray-200 mb-4">
                                    <span className="text-sm font-semibold">{module.name}</span>
                                    { /* <span className="text-sm">{'1 hora'}</span> */ }
                                </div>

                                <ul className="space-y-6">
                                    {module.lessons.map((lesson) => (
                                        <li key={lesson.id}>
                                            <Link
                                                className={`flex justify-between items-center mx-2 px-2 py-2 rounded-md ${currentLessonId == lesson.id ? 'bg-[#D8DADD]' : ''}`}
                                                to={`/app/lessons/${lesson.id}`}
                                            >
                                                <div className="flex items-center w-full space-x-2">
                                                    {lesson.isWatched ? (
                                                        <Video className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <Video className="w-4 h-4 text-gray-700" />
                                                    )}

                                                    <span className="text-sm flex-1 truncate">{lesson.name}</span>

                                                    <span className="text-xs text-gray-400">{lesson.duration}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}

export default LessonList;