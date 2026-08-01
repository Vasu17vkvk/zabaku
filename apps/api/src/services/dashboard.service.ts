import { Workspace } from "../models/Workspace";
import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { Activity } from "../models/Activity";

export async function getDashboardData(
    currentUserId: string
) {
    // Total counts
    const totalWorkspaces = await Workspace.countDocuments({
        "members.user": currentUserId,
    });

    const totalProjects = await Project.countDocuments({
        createdBy: currentUserId,
    });

    const totalTasks = await Task.countDocuments({
        createdBy: currentUserId,
    });

    // Task status summary
    const statusSummary = await Task.aggregate([
        {
            $match: {
                createdBy: totalTasks ? Task.db.base.Types.ObjectId.createFromHexString(currentUserId) : undefined,
            },
        },
        {
            $group: {
                _id: "$status",
                count: {
                    $sum: 1,
                },
            },
        },
    ]);

    // Task priority summary
    const prioritySummary = await Task.aggregate([
        {
            $match: {
                createdBy: totalTasks ? Task.db.base.Types.ObjectId.createFromHexString(currentUserId) : undefined,
            },
        },
        {
            $group: {
                _id: "$priority",
                count: {
                    $sum: 1,
                },
            },
        },
    ]);

    // Recent activity
    const recentActivity = await Activity.find({
        user: currentUserId,
    })
        .populate(
            "user",
            "firstName lastName avatar"
        )
        .sort({
            createdAt: -1,
        })
        .limit(10);

    return {
        totalWorkspaces,
        totalProjects,
        totalTasks,
        statusSummary,
        prioritySummary,
        recentActivity,
    };
}