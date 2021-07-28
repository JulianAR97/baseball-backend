const falseObjectValues = (obj) => {
  for (let k in obj) {
    if (!obj[k]) {
      delete obj[k]
    }
  }
  return obj
}

export default {falseObjectValues}