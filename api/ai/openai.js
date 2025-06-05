const fetch = require('node-fetch');

module.exports = function(app) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "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";

  async function OpenAi(teks) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // model paling murah
          messages: [
            {
              role: "user",
              content: teks
            }
          ]
        })
      });

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response from OpenAI API");
      }

      return data.choices[0].message.content.trim();

    } catch (err) {
      throw new Error("Failed to fetch from OpenAI API: " + err.message);
    }
  }

  app.get('/ai/openai', async (req, res) => {
    const { text, apikey } = req.query;

    if (!text) {
      return res.json({ status: false, error: 'Text is required' });
    }

    if (!apikey || !global.apikey.includes(apikey)) {
      return res.json({ status: false, error: 'Invalid or missing API key' });
    }

    try {
      const result = await OpenAi(text);
      res.status(200).json({
        status: true,
        result
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
