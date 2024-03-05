const chapaConfig = {
  headers: {
    Authorization: `Bearer ${process.env.CHAPA_AUTH}`,
  },
};

module.exports = chapaConfig;
