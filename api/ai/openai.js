const axios = require('axios');

module.exports = function (app) {
  app.get('/ai/chatgpt', async (req, res) => {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({
        status: false,
        message: 'Parameter "text" wajib diisi. Contoh: /ai/chatgpt?text=Halo, siapa kamu?'
      });
    }

    try {
      const apiUrl = `https://api.nekorinn.my.id/ai/gpt-4.1?text=${encodeURIComponent(text)}`;
      const response = await axios.get(apiUrl);

      // Respon berupa text langsung dari server
      if (typeof response.data === 'string') {
        return res.status(200).json({
          status: true,
          result: response.data.trim()
        });
      }

      // Kalau respons tidak sesuai ekspektasi
      res.status(500).json({
        status: false,
        message: 'Respon dari API tidak valid atau kosong'
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: 'Gagal mengambil jawaban dari API eksternal',
        error: err.message
      });
    }
  });
};
