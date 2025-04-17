import { redirect, type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = () => {
  throw redirect('/app/courses/price-action-academy');
}

export default function Index() {
  return (
    <h1>NO CONTENT</h1>  
  );
}

