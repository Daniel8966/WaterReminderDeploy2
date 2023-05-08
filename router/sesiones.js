// function manageSession(req, res, next, titulo) {

// }
function manageSession(viewName) {
  return function (req, res, next) {
    if (req.session.loggedin) {
      console.log('Sesion existente - ' + viewName)
      next();
    } else {
      console.log('NO hay sesion activa regresando en: ' + viewName)
      res.redirect('/login', 404, {
        login: false,
        name: 'Inicie Sesion'
      })
    }
  }
}
export default manageSession;