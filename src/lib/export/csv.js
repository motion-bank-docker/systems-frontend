import { DateTime, Interval } from 'luxon'
import constants from 'mbjs-data-models/src/constants'

const exportCSV = async function (items, filename) {
  let lastRefDate

  const entries = [[
    'Value',
    'Purpose',
    'Start',
    'Start (relative)',
    'Duration (s)',
    'Author',
    'Type',
    'Created',
    'Updated'
  ]].concat(items.map(annotation => {
    return [
      annotation.body.source.id ? annotation.body.source.id : annotation.body.value,
      annotation.body.purpose,
      annotation.target.selector.value,
      '',
      annotation.body.type === 'Video' ? annotation : '',
      annotation.author.name || 'Unknown',
      annotation.body.type,
      annotation.created,
      annotation.updated || ''
    ]
  }))
  for (let entry of entries) {
    if (entry[6] === 'Video') {
      lastRefDate = DateTime.fromISO(entry[2], { setZone: true })
      const { duration } = await this.$store.dispatch('metadata/get', entry[4])
      entry[4] = duration || ''
    }
    else if (lastRefDate) {
      entry[3] = Interval.fromDateTimes(
        lastRefDate,
        DateTime.fromISO(entry[2], { setZone: true })
      ).toDuration().toFormat(constants.TIMECODE_FORMAT)
    }
  }
  let csvData = 'data:text/csv;charset=utf-8,'
  entries.forEach(entry => {
    csvData += entry.map(v => `"${(v || '').toString().replace('"', '\\"').replace(';', '\\;')}"`).join(';') + '\r\n'
  })
  const download = document.createElement('a')
  download.setAttribute('href', encodeURI(csvData))
  download.setAttribute('download', `${filename}.csv`)

  return download
}

export default exportCSV
