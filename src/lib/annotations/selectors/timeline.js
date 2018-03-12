import { DateTime, Settings, Interval } from 'luxon'
import assert from 'assert'

Settings.defaultLocale = DateTime.local().resolvedLocaleOpts().locale

class TimelineSelector {
  /**
   * Create a new selector from local time or (optionally) UTC time
   * @param utc
   */
  constructor (utc = false) {
    if (utc) {
      this._dateTime = DateTime.local().toUTC()
    }
    else {
      this._dateTime = DateTime.local()
    }
  }

  /**
   * Set current time value to UTC time zone
   */
  setToUTC () {
    this._dateTime = this._dateTime.toUTC()
  }

  /**
   * Return ISO string (for serialization)
   * @return {string}
   */
  toString () {
    return this.isoString
  }

  /**
   * Get custom formatted string
   * @param format
   * @return {*|string}
   */
  toFormat (format) {
    assert.equal(typeof format, 'string')
    return this._dateTime.toFormat(format)
  }

  /**
   * Add duration or milliseconds
   * @param duration
   */
  add (duration) {
    assert(typeof duration === 'number' || duration.constructor.name === 'Duration')
    this._dateTime = this._dateTime.plus(duration)
  }

  /**
   * Subtract milliseconds
   * @param duration
   */
  subtract (duration) {
    assert(typeof duration === 'number' || duration.constructor.name === 'Duration')
    this._dateTime = this._dateTime.minus(duration)
  }

  /**
   * Set from ISO string
   * @param val
   */
  set isoString (val) {
    assert.equal(typeof val, 'string')
    this._dateTime = DateTime.fromISO(val)
  }

  /**
   * Get ISO string
   * @return {string}
   */
  get isoString () {
    return this._dateTime.toISO()
  }

  /**
   * Set from milliseconds
   * @param val
   */
  set millis (val) {
    assert.equal(typeof val, 'number')
    this._dateTime = DateTime.fromMillis(val)
  }

  /**
   * Get milliseconds
   * @return {Object}
   */
  get millis () {
    return this._dateTime.valueOf()
  }

  /**
   * Set luxon DateTime instance
   * @param val
   */
  set dateTime (val) {
    assert(val instanceof DateTime)
    this._dateTime = DateTime.fromISO(val.toISO())
  }

  get dateTime () {
    return this._dateTime
  }

  /**
   * Create new selector from ISO string
   * @param val
   * @return {TimelineSelector}
   */
  static fromISOString (val) {
    const selector = new TimelineSelector()
    selector.isoString = val
    return selector
  }

  /**
   * Create new selector from milliseconds
   * @param val
   * @return {TimelineSelector}
   */
  static fromMilliseconds (val) {
    const selector = new TimelineSelector()
    selector.millis = val
    return selector
  }

  /**
   * Create new selector from luxon DateTime object
   * @param val
   * @return {TimelineSelector}
   */
  static fromDateTime (val) {
    const selector = new TimelineSelector()
    selector.dateTime = val
    return selector
  }

  /**
   * Get duration between start and end selectors
   * @param start
   * @param end
   */
  static timeBetween (start, end) {
    assert.equal(start.constructor.name, 'TimelineSelector')
    assert.equal(end.constructor.name, 'TimelineSelector')
    return Interval.fromDateTimes(start.dateTime, end.dateTime).toDuration()
  }
}

export default TimelineSelector
