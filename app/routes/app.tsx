import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, Outlet, useNavigate } from "@remix-run/react";
import { ArrowLeft, Bell, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { getSession } from "~/lib/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get('cookie'));
    const user = session.get('user');

    if (!user) throw redirect("/login");

    return null;
}

export default function App() {

    const navigate = useNavigate();

    return (
        <main className="h-screen flex flex-col">
            {/* Header */}
            <header className="fixed z-30 top-0 left-0 w-screen h-[70px] bg-white flex items-center justify-between p-4 border-b">
                <Button variant="ghost" size="sm" className="text-principal" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Atrás
                </Button>
                <div className="flex items-center gap-4 cursor-pointer">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-principal rounded-full"></span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/app/profile/me")}>
                                <User className="mr-2 h-4 w-4" />
                                Perfil
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500 cursor-pointer">
                                <Link className="flex items-center" to={"/logout"}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar Sesión</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <div className="mt-[70px] flex-1">
                <Outlet />
            </div>
        </main>
    );
}
