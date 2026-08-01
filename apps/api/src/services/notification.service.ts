import { Notification } from "../models/Notification";
import { CreateNotificationDto } from "../dtos/notification/CreateNotification.dto";
import { getIO } from "../socket/socket";

export async function createNotification(
    data: CreateNotificationDto
) {
    const notification = await Notification.create({
        recipient: data.recipient,
        sender: data.sender,
        workspace: data.workspace,

        type: data.type,

        title: data.title,
        message: data.message,

        entityType: data.entityType,
        entityId: data.entityId,
    });

    const io = getIO();

    io.to(data.recipient).emit(
        "notification:new",
        notification
    );

    return notification;
}
export async function getNotifications(
    userId: string
) {
    return Notification.find({
        recipient: userId,
    })
        .populate(
            "sender",
            "firstName lastName avatar"
        )
        .sort({
            createdAt: -1,
        });
}

export async function markAsRead(
    notificationId: string,
    userId: string
) {
    const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId,
    });

    if (!notification) {
        throw new Error("Notification not found");
    }

    notification.isRead = true;

    await notification.save();

    return notification;
}

export async function markAllAsRead(
    userId: string
) {
    await Notification.updateMany(
        {
            recipient: userId,
            isRead: false,
        },
        {
            isRead: true,
        }
    );
}

export async function getUnreadCount(
    userId: string
) {
    return Notification.countDocuments({
        recipient: userId,
        isRead: false,
    });
}