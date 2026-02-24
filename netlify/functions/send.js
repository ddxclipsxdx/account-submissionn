exports.handler = async (event) => {
  try {
    const BOT_TOKEN = "8413503906:AAEFK581NgqwYwQQdTaT-8nMJEts9xXHNpA";  // <-- your bot token
    const CHAT_ID = "6442344136";

    const body = JSON.parse(event.body || "{}");
    const formattedText = body.numbers || ""; // This already has headers + numbers
    const filename = body.filename || "submission";

    // Just send the formatted text as-is - don't try to parse it
    const finalText = formattedText;

    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);

    const blob = new Blob([finalText], { type: "text/plain" });
    formData.append("document", blob, `${filename}.txt`);

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
      {
        method: "POST",
        body: formData
      }
    );

    const responseText = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        message: "Success",
        telegramResponse: responseText
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: err.toString() })
    };
  }
};
