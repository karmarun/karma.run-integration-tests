const {KarmaTools} = require('karma-tools-1-3')

exports.KarmaApi = class extends KarmaTools {

  constructor(props) {
    super(props)

    this.tQuery = this.tQuery.bind(this)
    this.create = this.create.bind(this)
  }

  async tQuery(t, query) {
    try {
      return await this.query(query)
    } catch (e) {
      t.fail(e)
    }
  }

  async create(t, tag, contextual) {
    const response = await this.tQuery(t, {
      "create": {
        "in": {
          "tag": tag
        },
        "value": {
          "contextual": contextual
        }
      }
    })
    t.is(response.status, 200, JSON.stringify(response.body))
    return response.body
  }
}

