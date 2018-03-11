import { DateTime, Settings } from 'luxon'
import assert from 'assert'

Settings.defaultLocale = DateTime.local().resolvedLocaleOpts().locale

class TimelineSelector {
  /**
   * Create a new selector from local time or (optionally) UTC time
   * @param utc
   * @param locale
   */
  constructor (utc = false, locale = undefined) {
    if (utc) {
      this._dateTime = DateTime
        .local({ locale: locale || Settings.defaultLocale }).toUTC()
    }
    else {
      this._dateTime = DateTime
        .local({ locale: locale || Settings.defaultLocale })
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
   * @param locale
   * @return {*|string}
   */
  toFormat (format, locale = undefined) {
    assert.equal(typeof format, 'string')
    if (locale) assert.equal(typeof locale, 'string')
    return this._dateTime.toFormat(format,
      { locale: this._dateTime.locale || Settings.defaultLocale })
  }

  /**
   * Add milliseconds
   * @param millis
   */
  add (millis) {
    assert.equal(typeof millis, 'number')
    this._dateTime = this._dateTime.plus(millis)
  }

  /**
   * Subtract milliseconds
   * @param millis
   */
  subtract (millis) {
    assert.equal(typeof millis, 'number')
    this._dateTime = this._dateTime.minus(millis)
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
    this._dateTime = DateTime.fromMillis(val,
      { locale: this._dateTime.locale || Settings.defaultLocale })
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
  static fromMilliseconds (val, utc = undefined, locale = undefined) {
    const selector = new TimelineSelector(utc, locale)
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
}

export default TimelineSelector
