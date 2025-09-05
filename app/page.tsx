import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function Home() {
  return (
   <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to HIGHED Exam Prep App</h1>
      <p className="text-lg text-center">
        Your one-stop solution for exam preparation. Get started by selecting a subject.
      </p>
      <div className="mt-10">
        <Button onClick={() => redirect("/dashboard")}>
          Get Started
        </Button>
      </div>
    </div>
  );
}
