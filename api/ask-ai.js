export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question } = req.body;

    if (!question || question.length > 300) {
      return res.status(400).json({ error: "Invalid question" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 120, // 💰 COST CONTROL
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content: "Answer step-by-step but keep it short (max 5 steps)."
          },
          {
            role: "user",
            content: question
          }
        ]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data.error?.message || "OpenAI error"
      });
    }

    return res.status(200).json({
      answer: data.choices?.[0]?.message?.content || "No answer"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error"
    });
  }
}
