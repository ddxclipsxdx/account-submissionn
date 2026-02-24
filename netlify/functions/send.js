exports.handler = async (event) => {
  try {
    const BOT_TOKEN = "8413503906:AAEFK581NgqwYwQQdTaT-8nMJEts9xXHNpA";  // <-- your bot token
    const CHAT_ID = "6442344136";

    const body = JSON.parse(event.body || "{}");
    const rawText = body.numbers || "";
    const filename = body.filename || "submission";

    // Split header and numbers section
    const lines = rawText.split("\n");

    let header = [];
    let numbers = [];

    const validPattern = /^(09\d{9}|9\d{9})$/;

    for (let line of lines) {
      const clean = line.trim();

      if (validPattern.test(clean)) {
        // Normalize 9xxxxxxxxx → 09xxxxxxxxx
        numbers.push(clean.startsWith("9") ? "0" + clean : clean);
      } else {
        // Keep header lines untouched
        header.push(line);
      }
    }

    // Remove duplicate numbers
    numbers = [...new Set(numbers)];

    const finalText =
      header.join("\n") +
      "\n\n" +
      numbers.join("\n");

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
