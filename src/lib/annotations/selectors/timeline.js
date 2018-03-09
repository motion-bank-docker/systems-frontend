import assert from 'assert'
import querystring from 'querystring'

class TimelineSelector {
  constructor (value) {
    this.m = 0
    this.s = 0
    /**
     * Parse seconds (with fractions)
     */
    if (typeof value === 'number') {
      value = {
        m: Math.floor(value / 60),
        s: value % 60
      }
    }
    /**
     * Parse param string
     */
    else if (typeof value === 'string') {
      value = TimelineSelector.parseString(value)
    }
    /**
     * Assign from value
     */
    if (typeof value === 'object') {
      this.m = value.m
      this.s = value.s
    }
  }

  toString () {
    return querystring.stringify(this)
  }

  toTimecodeString () {
    return `${Math.round(this.m).toString().padStart(2, '0')}:${(this.s).toFixed(3).padStart(6, '0')}`
  }

  toSeconds () {
    return (parseInt(this.m) || 0) * 60 + (parseFloat(this.s) || 0)
  }

  static parseString (value) {
    assert.equal(typeof val, 'string')
    const obj = querystring.parse(value)
    Object.keys(obj).forEach(key => {
      obj[key] = parseFloat(obj[key])
    })
    return obj
  }
}

export default TimelineSelector
