export const addCaseInsensitive = (query) => {
  for (let k in query) {
    query[k] = { $regex: `${query[k]}`, $options: 'i' }
  }
  console.log(query)
  return query
}