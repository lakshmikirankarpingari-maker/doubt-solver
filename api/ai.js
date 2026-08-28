export default async function handler(req, res) {
  try {
    const { question } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful AI that solves student doubts clearly." },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();

    res.status(200).json({
      answer: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
