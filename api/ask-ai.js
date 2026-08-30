export default async function handler(req, res) {
  try {

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({ answer: null });
    }

    const { question } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Explain clearly." },
          { role: "user", content: question }
        ],
      }),
    });

    const data = await response.json();

    res.status(200).json({
      answer: data?.choices?.[0]?.message?.content || null
    });

  } catch {
    res.status(200).json({ answer: null });
  }
}
