const service = require('../services/notificationService');
const Log = require('../../logging_middleware');

exports.create = async (req, res) => {
    try {
        const result = service.createNotification(req.body);

        const logResult = await Log("backend", "info", "controller", "Notification created");

        res.status(201).json({
            data: result,
            log: logResult
        });

    } catch (err) {
        const logResult = await Log("backend", "error", "controller", err.message);

        res.status(500).json({
            message: "Error creating notification",
            log: logResult
        });
    }
};

exports.getAll = async (req, res) => {
    let data = service.getAllNotifications();

    if (req.query.read !== undefined) {
        const isRead = req.query.read === "true";
        data = data.filter(n => n.read === isRead);
    }

    const logResult = await Log("backend", "info", "controller", "Fetched notifications");

    res.json({
        data,
        log: logResult
    });
};

exports.getOne = async (req, res) => {
    const id = parseInt(req.params.id);

    const data = service.getNotificationById(id);

    if (!data) {
        const logResult = await Log("backend", "warn", "controller", "Notification not found");

        return res.status(404).json({
            message: "Not found",
            log: logResult
        });
    }

    res.json(data);
};

exports.markRead = async (req, res) => {
    const id = parseInt(req.params.id);

    const data = service.markAsRead(id);

    if (!data) {
        const logResult = await Log("backend", "warn", "controller", "Notification not found");

        return res.status(404).json({
            message: "Not found",
            log: logResult
        });
    }

    const logResult = await Log("backend", "info", "controller", "Notification marked as read");

    res.json({
        data,
        log: logResult
    });
};

// ✅ THIS WAS MISSING OR BROKEN
exports.delete = async (req, res) => {
    const id = parseInt(req.params.id);

    const data = service.deleteNotification(id);

    if (!data) {
        const logResult = await Log("backend", "warn", "controller", "Notification not found for delete");

        return res.status(404).json({
            message: "Not found",
            log: logResult
        });
    }

    const logResult = await Log("backend", "info", "controller", "Notification deleted");

    res.json({
        data,
        log: logResult
    });
};