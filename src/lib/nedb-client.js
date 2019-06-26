import { ObjectUtil } from 'mbjs-utils'
import * as Datastore from 'nedb'
import { Platform } from 'quasar'

class NedbClient {
  constructor (options = {}) {
    this._options = options
    this._stores = {}
  }

  checkStore (resource) {
    if (!this._stores[resource]) {
      const options = ObjectUtil.merge({}, this.options, { autoload: true })
      if (options.filename && Platform.is.electron) {
        options.filename = `${options.filename}-${resource}.nedb`
      }
      this._stores[resource] = new Datastore(options)
    }
  }

  async find (resource, query, select = undefined) {
    this.checkStore(resource)
    const items = await new Promise((resolve, reject) => {
      this._stores[resource].find(query, select, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
    return { items }
  }

  async get (resource, id, select = undefined) {
    this.checkStore(resource)
    const _this = this
    const item = await new Promise((resolve, reject) => {
      const getHandler = (err, res) => {
        if (err) reject(err)
        else resolve(res)
      }
      const args = [{ uuid: id }]
      if (select) args.push(select)
      args.push(getHandler)
      _this._stores[resource].findOne.apply(_this._stores[resource], args)
    })
    return item
  }

  async post (resource, data) {
    this.checkStore(resource)
    for (let key in data) {
      if (key[0] === '_') delete data[key]
    }
    if (!data.uuid) data.uuid = ObjectUtil.uuid4()
    const _this = this
    const item = await new Promise((resolve, reject) => {
      _this._stores[resource].insert(data, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
    return item
  }

  async patch (resource, id, data) {
    this.checkStore(resource)
    const _this = this
    for (let key in data) {
      if (key[0] === '_') delete data[key]
    }
    let item = await this.get(resource, id)
    item = ObjectUtil.merge(item, data)
    await new Promise((resolve, reject) => {
      _this._stores[resource].update({ uuid: id }, item, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
    return item
  }

  async put (resource, id, data) {
    this.checkStore(resource)
    const _this = this
    for (let key in data) {
      if (key[0] === '_') delete data[key]
    }
    await new Promise((resolve, reject) => {
      _this._stores[resource].update({ uuid: id }, data, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
    return data
  }

  async delete (resource, id) {
    this.checkStore(resource)
    await new Promise((resolve, reject) => {
      this._stores[resource].remove({ uuid: id }, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
    return {}
  }

  get options () {
    return this._options
  }
}
export default NedbClient
