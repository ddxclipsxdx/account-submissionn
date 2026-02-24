exports.handler = async (event) => {
  try {
    const BOT_TOKEN = "8413503906:AAEFK581NgqwYwQQdTaT-8nMJEts9xXHNpA";   // <-- your bot token
    const CHAT_ID = "6442344136";

    const body = JSON.parse(event.body || "{}");
    const rawText = body.numbers || "";
    const filename = body.filename || "submission";

    // Extract only valid numbers
    const validPattern = /^(09\d{9}|9\d{9})$/;

    const lines = rawText
      .replace(/,/g, "\n")
      .replace(/\s+/g, "\n")
      .split("\n")
      .map(n => n.trim())
      .filter(Boolean);

    let cleanedNumbers = [];

    for (let num of lines) {
      if (!validPattern.test(num)) continue;

      if (num.startsWith("9")) num = "0" + num;
      cleanedNumbers.push(num);
    }

    // Remove duplicates
    cleanedNumbers = [...new Set(cleanedNumbers)];

    // Build final text
    const finalText = cleanedNumbers.join("\n") || "No valid numbers.";

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

    const result = await response.text();

    return {
      statusCode: 200,
      body: result
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString()
    };
  }
};
