import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useActionData } from "@remix-run/react";
import { ALAN_COURSE_ID, API_BASE_URL } from "~/api/config";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { getSession } from "~/lib/session.server";
import logo from "~/assets/art-of-reset-logo.png";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request.headers.get('cookie'));
    const user = session.get('user');

    if (user) throw redirect(`/app/courses/${ALAN_COURSE_ID}`);

    return null;
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get('email') as string;

    if (!email || email === "") {
        return { error: 'Ingresa el correo' }
    }

    const verifyResponse = await fetch(`${API_BASE_URL}/users/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if(!verifyResponse.ok){
        return { error: 'Error de comunicación con los servidores.' }
    }

    const { isValid } = await verifyResponse.json();

    if(!isValid){
        return { error: 'Correo no inscrito' }
    }

    return redirect(`/verify?email=${email}`)
}

export default function LoginPage() {

    const actionData = useActionData<typeof action>();

    return (
        <div className="flex min-h-screen box-content">
            { /* Left side logo*/}
            <div className="hidden md:flex md:w-1/2 bg-principal box-content">
                <img alt="login-logo" src={logo} className="w-full h-full object-cover" />
            </div>

            { /*Rigth side form */}
            <div className="w-full md:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Iniciar sesión</h2>
                        <p>Ingresa tu correo electrónico para recibir un código de verificación</p>
                    </div>

                    <Form method="post" id="login-form" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="correo@bloop.com"
                                autoComplete="email"
                                className="transition-all duration-200"
                            />
                            {actionData?.error && (
                                <p className="text-xs text-red-500">
                                    {actionData.error}
                                </p>
                            )}
                        </div>
                        <Button type="submit" className="w-full bg-principal hover:brightness-125">
                            Continuar con el correo electrónico
                        </Button>
                    </Form>

                    <Separator />

                    <div className="text-sm text-gray-500">
                        Al continuar, aceptas nuestros{" "}
                        <a href="/terms-of-service" className="underline underline-offset-4 hover:text-gray-900">
                            Términos de servicio
                        </a>{" "}
                        y{" "}
                        <a href="/privacy-policy" className="underline underline-offset-4 hover:text-gray-900">
                            política de privacidad.
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}