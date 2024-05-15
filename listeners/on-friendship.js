const {
  types: { Friendship },
} = require("wechaty");

async function onFriendship(friendship) {
  if (friendship.type() === Friendship.Receive) {
    // await friendship.accept();
  }
}
module.exports = onFriendship;
