import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  ChartColumn,
  MessageSquareText,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              AI
            </div>

            <h1 className="text-lg font-bold">
              AI Interview
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">
                Login
              </Button>
            </Link>

            <Link href="/register">
              <Button>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <div className="mb-6 rounded-full border px-4 py-1 text-sm text-muted-foreground">
            AI Powered Interview Platform
          </div>

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
            Smarter Technical Interviews
            with Artificial Intelligence
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Automate candidate screening,
            evaluate responses with AI,
            and streamline your hiring
            process efficiently.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                className="gap-2"
              >
                Start Interview
                <ArrowRight size={18} />
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
              >
                Login Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <BrainCircuit className="text-primary" />
            </div>

            <h3 className="mb-2 text-xl font-semibold">
              AI Evaluation
            </h3>

            <p className="text-muted-foreground">
              Analyze candidate answers
              automatically using AI
              scoring and assessment.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquareText className="text-primary" />
            </div>

            <h3 className="mb-2 text-xl font-semibold">
              Real-time Interview
            </h3>

            <p className="text-muted-foreground">
              Conduct structured technical
              interviews interactively and
              efficiently.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ChartColumn className="text-primary" />
            </div>

            <h3 className="mb-2 text-xl font-semibold">
              Analytics Dashboard
            </h3>

            <p className="text-muted-foreground">
              Track candidate performance
              with detailed analytics and
              insights.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight">
            Ready to Transform Your
            Recruitment Process?
          </h2>

          <p className="mt-4 max-w-xl text-muted-foreground">
            Start using AI Interview today
            and improve hiring quality with
            intelligent candidate evaluation.
          </p>

          <Link
            href="/register"
            className="mt-8"
          >
            <Button
              size="lg"
              className="gap-2"
            >
              Get Started
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}