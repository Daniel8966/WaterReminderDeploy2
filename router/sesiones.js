function manageSession(req, res, next, titulo) {
  if (req.session.loggedin) {
    console.log('Sesion existente - ' + titulo)
    return true;
  } else {
    console.log('NO hay sesion activa regresando en: ' + titulo)
    res.redirect('/login', 404, {
      login: false,
      name: 'Inicie Sesion'
    })
  }
}

export default manageSession;