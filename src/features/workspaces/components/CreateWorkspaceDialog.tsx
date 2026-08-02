import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useWorkspace } from "@/context/WorkspaceContext";
import { useCreateWorkspace } from "../hooks";

interface CreateWorkspaceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateWorkspaceDialog({
    open,
    onOpenChange,
}: CreateWorkspaceDialogProps) {
    const createWorkspace = useCreateWorkspace();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [industry, setIndustry] = useState("");
    const [teamSize, setTeamSize] = useState("");

    const resetForm = () => {
        setName("");
        setSlug("");
        setIndustry("");
        setTeamSize("");
    };

    const handleSubmit = async () => {
        try {
            const workspace = await createWorkspace.mutateAsync({
                name,
                slug,
                industry,
                teamSize,
            });


            resetForm();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>

                    <DialogDescription>
                        Create a new workspace for your team.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Workspace Name
                        </Label>

                        <Input
                            id="name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Acme Inc."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">
                            Workspace Slug
                        </Label>

                        <Input
                            id="slug"
                            value={slug}
                            onChange={(e) =>
                                setSlug(e.target.value)
                            }
                            placeholder="acme"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="industry">
                            Industry
                        </Label>

                        <Input
                            id="industry"
                            value={industry}
                            onChange={(e) =>
                                setIndustry(e.target.value)
                            }
                            placeholder="Software"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="teamSize">
                            Team Size
                        </Label>

                        <Input
                            id="teamSize"
                            value={teamSize}
                            onChange={(e) =>
                                setTeamSize(e.target.value)
                            }
                            placeholder="11-50"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={
                            createWorkspace.isPending ||
                            !name.trim() ||
                            !slug.trim()
                        }
                    >
                        {createWorkspace.isPending
                            ? "Creating..."
                            : "Create Workspace"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}