
/**
 * GET /
 * Show the main application.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Simulador de Cajero Automático',
  });
};
