const indexer = annotations => {
  const results = {
    authors: [],
    purposes: []
  }
  annotations.forEach(annotation => {
    let addAuthor = true
    results.authors.forEach(author => {
      if (annotation.author.uuid === author.uuid) addAuthor = false
    })
    if (addAuthor) results.authors.push(annotation.author)

    let addPurpose = true
    results.purposes.forEach(purpose => {
      if (annotation.body.purpose === purpose) addPurpose = false
    })
    if (addPurpose) results.purposes.push(annotation.body.purpose)
  })
}

export {
  indexer
}
