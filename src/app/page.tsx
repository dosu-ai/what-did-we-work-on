"use client";

import { ChangeEvent, useState } from "react";
import type { githubTypes } from "@opensdks/sdk-github";
import CommitsList from "@/components/CommitsList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchCommits, summarizeCommits } from "./actions";

type Commit = githubTypes["components"]["schemas"]["commit"];

export default function Component() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [prLink, setPrLink] = useState("");
  const [summary, setSummary] = useState<string | null>("");

  return (
    <div className="flex flex-col w-md min-h-screen p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">GitHub PR Summary</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Enter a GitHub PR link to view a summary of the commits.
        </p>
        <form
          className="space-y-4"
          action={async (formData: FormData) => {
            const prLink = formData.get("pr-link") as string;
            if (!prLink) {
              return;
            }
            const fetchedCommits = await fetchCommits(prLink);
            setCommits(fetchedCommits);
            const summary = await summarizeCommits(fetchedCommits);
            setSummary(summary);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="pr-link">Pull Request Link</Label>
            <Input
              id="pr-link"
              name="pr-link"
              placeholder="https://github.com/user/repo/pull/123"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPrLink(e.target.value);
              }}
              required
            />
          </div>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            type="submit"
          >
            Analyze
          </Button>
        </form>
        <Card className="mt-8 max-w-md">
          <div className="">
            <CardHeader>
              <CardTitle className="text-xl">Summarized Commits</CardTitle>
              <CardDescription>
                A brief summary of all commits generated by OpenAI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 text-sm break-words">
                {summary || "OpenAI generated commit summary goes here..."}
              </p>
            </CardContent>
          </div>
        </Card>
        <Card className="mt-8 max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Commits Summary</CardTitle>
            <CardDescription>
              List of commits for the provided GitHub PR
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <CommitsList commits={commits} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
