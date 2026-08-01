import { Activity } from "../models/Activity";
import { CreateActivityDto } from "../dtos/activity/CreateActivity.dto";

export async function logActivity(data: CreateActivityDto) {
    console.log("🔥 logActivity called");
    console.log(data);

    try {
        const activity = await Activity.create({
            workspace: data.workspace,
            project: data.project,
            task: data.task,
            user: data.user,
            action: data.action,
            entityType: data.entityType,
            entityId: data.entityId,
            metadata: data.metadata ?? {},
        });

        console.log("✅ Activity created:", activity);

        return activity;
    } catch (error) {
        console.error("❌ Activity error:", error);
        throw error;
    }
}

export async function getTaskActivity(
    taskId: string
) {
    return Activity.find({
        task: taskId,
    })
        .populate(
            "user",
            "firstName lastName avatar"
        )
        .sort({
            createdAt: -1,
        });
}

