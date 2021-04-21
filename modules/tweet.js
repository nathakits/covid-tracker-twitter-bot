const Twitter = require('twitter-lite');

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const tweetPost = async (data) => {
  await client.post("statuses/update", {
    status: data,
  })
}

const tweetThread = async (thread) => {
  let lastTweetID = "";
  for (const status of thread) {
    const tweet = await client.post("statuses/update", {
      status: status,
      in_reply_to_status_id: lastTweetID,
      auto_populate_reply_metadata: true
    });
    lastTweetID = tweet.id_str;
    return status
  }
}

module.exports = {
  tweetPost,
  tweetThread
}