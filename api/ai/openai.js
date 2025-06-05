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
