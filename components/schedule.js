const schedule = require('node-schedule');

const tasks = {};

module.exports = {
    startTask(taskId, cron, task) {
        tasks[taskId] = schedule.scheduleJob(cron, task);
    },
    stopTask(taskId) {
        tasks[taskId] && tasks[taskId].cancel();
        delete tasks[taskId];
    }
}