const fetch = require('node-fetch');

module.exports = function(app) {
  // Fungsi utama untuk memanggil API GPT3 dari siputzx.my.id
  async function PublicGPT3(teks) {
    try {
      const prompt = encodeURIComponent("kamu adalah ai yang ceria");
      const content = encodeURIComponent(teks);
      const url = `https://api.siputzx.my.id/api/ai/gpt3?prompt=${prompt}&content=${content}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "accept": "*/*"
        }
      });

      const result = await response.text();

      if (!result) {
        throw new Error("Empty response from GPT3 API");
      }

      return result.trim();
    } catch (err) {
      throw new Error("Failed to fetch from GPT3 API: " + err.message);
    }
  }

  // Endpoint /ai/gpt3
  app.get('/ai/gpt3', async (req, res) => {
    const { text, apikey } = req.query;

    if (!text) {
      return res.json({ status: false, error: 'Text is required' });
    }

    if (!apikey || !global.apikey.includes(apikey)) {
      return res.json({ status: false, error: 'Invalid or missing API key' });
    }

    try {
      const result = await PublicGPT3(text);
      res.status(200).json({
        status: true,
        result
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
