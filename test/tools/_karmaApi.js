const {KarmaTools} = require('karma-tools-1-3')

exports.KarmaApi = class extends KarmaTools {
  async tQuery (t, query) {
    try {
      return await this.query(query)
    } catch (e) {
      t.fail(e.message)
    }
  }
}

