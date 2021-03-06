import toMaterialStyle from 'material-color-hash'

const getAnnotationColor = annotation => {
  if (!annotation) return {}

  let type = annotation.body.source ? annotation.body.source.type : undefined
  type = type || annotation.body.type
  type = type && type.indexOf('#') > -1 ? type.split('#').pop() : type
  return toMaterialStyle(type || 'SpecificResource', '100')
}

export {
  getAnnotationColor
}
