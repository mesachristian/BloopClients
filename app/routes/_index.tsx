import { redirect } from "@remix-run/node";
import { ALAN_COURSE_ID } from "~/api/config";

export const loader = () => {
  throw redirect(`/app/courses/${ALAN_COURSE_ID}`);
}

export default function Index() {
  return (
    <h1>NO CONTENT</h1>  
  );
}