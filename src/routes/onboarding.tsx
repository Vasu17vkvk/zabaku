import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/onboarding")({
    component: OnboardingPage,
});

function OnboardingPage() {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [industry, setIndustry] = useState("");
    const [teamSize, setTeamSize] = useState("");

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-lg rounded-xl border bg-background p-8 shadow-sm">
                <h1 className="text-3xl font-bold">
                    Welcome to Zabaku 👋
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Let's create your first workspace to get started.
                </p>

                <div className="mt-8 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Workspace Name
                        </Label>

                        <Input
                            id="name"
                            placeholder="Acme Inc."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">
                            Workspace Slug (Optional)
                        </Label>

                        <Input
                            id="slug"
                            placeholder="acme"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="industry">
                            Industry (Optional)
                        </Label>

                        <Input
                            id="industry"
                            placeholder="Software"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="teamSize">
                            Team Size (Optional)
                        </Label>

                        <Input
                            id="teamSize"
                            placeholder="11-50"
                            value={teamSize}
                            onChange={(e) => setTeamSize(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full"
                        disabled={!name.trim()}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}