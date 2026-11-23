module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  const key = process.env.GEMINI_API_KEY || "";
  res.status(200).send(
    `window.GOOD_EDU_LOCAL_ENV = window.GOOD_EDU_LOCAL_ENV || { GEMINI_API_KEY: ${JSON.stringify(key)} };`
  );
};
