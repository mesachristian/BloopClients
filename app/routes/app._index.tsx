import { redirect, type MetaFunction } from "@remix-run/node";
import { ALAN_COURSE_ID } from "~/api/config";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = () => {
  throw redirect(`/app/courses/${ALAN_COURSE_ID}`);
}

export default function Index() {
  return (
    <h1>NO CONTENT</h1>  
  );
}

