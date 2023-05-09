// function manageSession(req, res, next, titulo) {

// }
function manageSession(titulo) {
  return function (req, res, next) {
    if (req.session.loggedin) {
      console.log('Sesion existente - ' + titulo)
      next();
    } else {
      console.log('NO hay sesion activa regresando en: ' + titulo)
      res.redirect('/login', 404, {
      })
    }
  }
}
export default manageSession;