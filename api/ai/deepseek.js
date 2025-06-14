const fetch = require('node-fetch');

module.exports = function(app) {
  app.get('/ai/deepseek', async (req, res) => {
    const { text, apikey } = req.query;

    if (!text) {
      return res.json({ status: false, error: 'Text is required' });
    }

    if (!apikey || !global.apikey.includes(apikey)) {
      return res.json({ status: false, error: 'Invalid or missing API key' });
    }

    try {
      const encodedPrompt = encodeURIComponent("You are an assistant that always responds in Indonesian with a friendly and informal tone");
      const encodedText = encodeURIComponent(text);
      const url = `https://api.siputzx.my.id/api/ai/deepseek?prompt=${encodedPrompt}&message=${encodedText}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "accept": "*/*"
        }
      });

      const data = await response.text();

      if (!data) {
        throw new Error("No response from DeepSeek public API");
      }

      res.status(200).json({
        status: true,
        result: data.trim()
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
