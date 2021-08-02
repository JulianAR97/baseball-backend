
const getRoutes = (router) => {
  return router.stack.map(r => r.route?.path)
}

const concatRoutes = (routes) => {
  let concat = []
  for (let k in routes) {
    routes[k] = routes[k].forEach(r => concat.push(`${k}${r}`))
  }
  return concat
}

export default { getRoutes, concatRoutes }