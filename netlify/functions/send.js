exports.handler = async (event) => {
  try {
    const BOT_TOKEN = "8413503906:AAEFK581NgqwYwQQdTaT-8nMJEts9xXHNpA";
    const CHAT_ID = "6442344136";

    const body = JSON.parse(event.body || "{}");
    const numbers = body.numbers || "";
    const filename = body.filename || "submission";

    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);

    const blob = new Blob([numbers], { type: "text/plain" });
    formData.append("document", blob, `${filename}.txt`);

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
      {
        method: "POST",
        body: formData
      }
    );

    return {
      statusCode: 200,
      body: await response.text()
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString()
    };
  }
};
