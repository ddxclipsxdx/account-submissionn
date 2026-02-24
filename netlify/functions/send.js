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

    for (let line of lines) {
      // Remove invisible Unicode characters (like U+200E) and trim
      const clean = line.replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim();
      
      // Skip empty lines
      if (clean === "") continue;

      // Check if line contains only digits after cleaning
      if (/^\d+$/.test(clean)) {
        const length = clean.length;
        
        // Handle different phone number formats
        if (length === 10) {
          // 10-digit number
          if (clean.startsWith("9")) {
            numbers.push("0" + clean); // Add leading 0
          } else {
            numbers.push(clean);
          }
        } else if (length === 11) {
          // 11-digit number
          if (clean.startsWith("09")) {
            numbers.push(clean);
          } else {
            numbers.push(clean);
          }
        } else if (length === 12 && clean.startsWith("09")) {
          // 12-digit with leading 09 (should be 11 digits normally)
          numbers.push(clean);
        } else {
          // Not a valid phone number length, treat as header
          header.push(line);
        }
      } else {
        // Contains non-digits (after cleaning), check if it's actually a number with special chars
        // Try to extract digits only
        const digitsOnly = clean.replace(/\D/g, '');
        if (digitsOnly.length >= 10 && digitsOnly.length <= 12) {
          // It's probably a number with some formatting
          let phoneNumber = digitsOnly;
          if (phoneNumber.length === 10 && phoneNumber.startsWith("9")) {
            phoneNumber = "0" + phoneNumber;
          }
          numbers.push(phoneNumber);
        } else {
          // Keep header lines untouched
          header.push(line);
        }
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
