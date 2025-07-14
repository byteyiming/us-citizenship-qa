"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4">
      <div className="w-full max-w-2xl space-y-10">
        <div className="text-center space-y-3">
          <h1 className="flex items-center justify-center gap-2 text-4xl font-extrabold tracking-tight">
            <Sparkles className="text-blue-500 h-8 w-8" />
            Citizenship Pro
          </h1>
          <p className="text-lg text-muted-foreground">
            Bilingual US Citizenship Test Practice
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 w-full">
          <Card className="rounded-2xl shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur text-center py-8">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Multiple Choice</CardTitle>
              <CardDescription>Instant feedback, bilingual questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/quiz">
                <Button className="rounded-full px-8 py-3 text-lg font-bold shadow-md bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 transition-transform text-white">
                  Start
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur text-center py-8">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Writing (Soon)</CardTitle>
              <CardDescription>AI writing assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="rounded-full px-8 py-3 text-lg font-bold shadow-md bg-gradient-to-r from-blue-400 to-purple-400 text-white opacity-60 cursor-not-allowed">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}