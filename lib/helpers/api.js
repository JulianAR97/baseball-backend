
const getRoutes = (router) => {
  return router.stack.map(r => r.route?.path)
}

export default { getRoutes }