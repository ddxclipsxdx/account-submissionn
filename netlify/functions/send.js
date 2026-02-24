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

    // Updated pattern to match:
    // - Numbers starting with 0 followed by 10 digits (total 11)
    // - Numbers starting with 9 followed by 9 digits (total 10)
    // - Numbers that are exactly 10 or 11 digits and contain only numbers
    const validPattern = /^(\d{10,11})$/;

    for (let line of lines) {
      const clean = line.trim();
      
      // Skip empty lines
      if (clean === "") continue;

      // Check if line contains only digits and has valid length
      if (/^\d+$/.test(clean)) {
        const length = clean.length;
        
        // Handle different phone number formats
        if (length === 10) {
          // 10-digit number (9xxxxxxxxx format)
          if (clean.startsWith("9")) {
            numbers.push("0" + clean); // Add leading 0
          } else {
            // Could be a 10-digit number starting with something else
            numbers.push(clean);
          }
        } else if (length === 11) {
          // 11-digit number (09xxxxxxxxx format)
          if (clean.startsWith("09")) {
            numbers.push(clean);
          } else {
            // 11 digits but not starting with 09 - still keep as is
            numbers.push(clean);
          }
        } else {
          // Not a valid phone number length, treat as header
          header.push(line);
        }
      } else {
        // Contains non-digits, treat as header
        header.push(line);
      }
    }

    // Remove duplicate numbers
    numbers = [...new Set(numbers)];

    console.log(`Found ${numbers.length} unique numbers`); // Debug log

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
      body: JSON.stringify({ 
        message: "Success", 
        numbersFound: numbers.length,
        telegramResponse: await response.text()
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.toString() })
    };
  }
};
