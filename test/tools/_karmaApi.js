const {KarmaTools} = require('./_karma_tools')
const {karmaFunction} = require('./_function')

exports.KarmaApi = class extends KarmaTools {

  constructor (props) {
    super(props)

    this.tQuery = this.tQuery.bind(this)
    this.create = this.create.bind(this)
  }

  async tQuery (t, exampleName, ...queries) {
    if (arguments.length < 3) {
      throw new Error("Expecting min 3 arguments for tQuery. Did you forgot exampleName?")
    }
    queries = karmaFunction([], ...queries)
    return await this.query(queries)
  }

  async create (t, tag, value) {
    return await this.tQuery(t, [
      "create", {
        "in": [
          "tag", ["string", tag]
        ],
        "value": value
      }
    ])
  }
}

