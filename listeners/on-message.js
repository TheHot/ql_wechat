const config = require("../config");
const Task = require("../task");

/**
 * 处理消息
 */
async function onMessage(msg, bot) {
  //防止自己和自己对话
  if (msg.self()) return;
  const room = msg.room(); // 是否是群消息
  if (room) return;
  //处理用户消息  用户消息暂时只处理文本消息。后续考虑其他
  const isText = msg.type() === bot.Message.Type.Text;
  if (isText) {
    await onPeopleMessage(msg, bot);
  }
}
/**
 * 处理用户消息
 */
const contactMap = {};

async function onPeopleMessage(msg, bot) {
  // 获取发消息人
  const contact = msg.talker();
  // 对config配置文件中 ignore的用户消息不必处理
  if (config.IGNORE.includes(contact.payload.name)) return;
  const content = msg.text().trim(); // 消息内容 使用trim()去除前后空格

  /**
   * 查询当前 id 是否存在任务队列，如果存在则取出任务队列进行执行，否则初始化一个新的任务队列
   */
  const task = contactMap?.[contact.id];

  if (content === "q") {
    if (task) {
      delete contactMap?.[contact.id];
      msg.say("谢谢光临，客官慢走~");
    }
    return;
  }

  if (task) {
    const status = await task.run(msg);
    if (status === "done") {
      delete contactMap?.[contact.id];
    }
  } else {
    contactMap[contact.id] = new Task(msg, bot);
  }
}

module.exports = onMessage;
