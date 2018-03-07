const {KarmaTools} = require('./_karma_tools')

exports.KarmaApi = class extends KarmaTools {

  constructor (props) {
    super(props)

    this.tQuery = this.tQuery.bind(this)
    this.create = this.create.bind(this)
  }

  async tQuery (t, query) {
    return await this.query(query)
  }

  async create (t, tag, value) {
    const response = await this.tQuery(t, [
      "create", {
        "in": [
          "tag", ["string", tag]
        ],
        "value": value
      }
    ])
    return response
  }
}

