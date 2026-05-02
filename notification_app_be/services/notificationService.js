const notifications = require('../data/db');

// ✅ Fix ID issue
let currentId = 1;

// CREATE
function createNotification(data) {
    const newNotification = {
        id: currentId++,
        message: data.message,
        read: false,
        createdAt: new Date()
    };

    notifications.push(newNotification);
    return newNotification;
}

// READ ALL
function getAllNotifications() {
    return notifications;
}

// READ ONE
function getNotificationById(id) {
    return notifications.find(n => n.id === id);
}

// UPDATE (mark as read)
function markAsRead(id) {
    const notification = notifications.find(n => n.id === id);

    if (notification) {
        notification.read = true;
    }

    return notification;
}

// ✅ DELETE (THIS WAS MISSING)
function deleteNotification(id) {
    const index = notifications.findIndex(n => n.id === id);

    if (index === -1) return null;

    const deleted = notifications.splice(index, 1);
    return deleted[0];
}

// ✅ EXPORT EVERYTHING (VERY IMPORTANT)
module.exports = {
    createNotification,
    getAllNotifications,
    getNotificationById,
    markAsRead,
    deleteNotification   // 👈 THIS LINE FIXES YOUR ERROR
};