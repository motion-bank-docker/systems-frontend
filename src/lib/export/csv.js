const exportCSV = function (items, filename = undefined) {
  const entries = [[
    'Value',
    'Purpose',
    'Start',
    'Duration (s)',
    'Author',
    'Type',
    'Created',
    'Updated'
  ]].concat(items.map(annotation => {
    const
      parsed = annotation.target.selector.parse(),
      dateTime = parsed['date-time:t'],
      start = Array.isArray(dateTime) ? dateTime[0].toISO() : dateTime.toISO(),
      duration = annotation.target.selector.getDuration()
    return [
      annotation.body.source.id ? annotation.body.source.id : annotation.body.value,
      annotation.body.purpose,
      start,
      duration ? duration.as('seconds') : '',
      annotation.creator.name || 'Unknown',
      annotation.body.type,
      annotation._created,
      annotation._updated || ''
    ]
  }))
  let csvData = 'data:text/csv;charset=utf-8,'
  entries.forEach(entry => {
    csvData += entry.map(v => `"${(v || '').toString().replace('"', '\\"')}"`).join(';') + '\r\n'
  })
  const download = document.createElement('a')
  download.setAttribute('href', encodeURI(csvData))
  if (filename) download.setAttribute('download', filename)

  return download
}

export default exportCSV
