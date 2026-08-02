import { Workspace } from "../api";
import { useWorkspace } from "@/context/WorkspaceContext";

interface WorkspaceCardProps {
    workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
    const { workspaceId, setWorkspace } = useWorkspace();

    const isActive = workspace.id === workspaceId;

    return (
        <div
            className={`rounded-xl border p-5 transition-all ${isActive
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white hover:border-orange-300"
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {workspace.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                        Slug: {workspace.slug}
                    </p>

                    {workspace.industry && (
                        <p className="text-sm text-gray-500">
                            Industry: {workspace.industry}
                        </p>
                    )}

                    {workspace.teamSize && (
                        <p className="text-sm text-gray-500">
                            Team Size: {workspace.teamSize}
                        </p>
                    )}

                    <p className="text-sm text-gray-500">
                        Members: {workspace.membersCount ?? 0}
                    </p>
                </div>

                <button
                    onClick={() => setWorkspace(workspace.id)}
                    disabled={isActive}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${isActive
                            ? "cursor-default bg-green-100 text-green-700"
                            : "bg-orange-500 text-white hover:bg-orange-600"
                        }`}
                >
                    {isActive ? "Selected" : "Select"}
                </button>
            </div>
        </div>
    );
}