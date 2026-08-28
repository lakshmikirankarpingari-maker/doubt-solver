 export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful STEM tutor. Give clear step-by-step answers."
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    const data = await response.json();

    // 🔴 IMPORTANT: handle API errors
    if (!response.ok) {
      console.error(data);
      return res.status(500).json({
        error: data.error?.message || "OpenAI API error"
      });
    }

    res.status(200).json({
      answer: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
