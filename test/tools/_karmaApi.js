const {KarmaTools} = require('./_karma_tools')
const {functionReturn} = require('./_function')

exports.KarmaApi = class extends KarmaTools {

  constructor (props) {
    super(props)

    this.tQuery = this.tQuery.bind(this)
    this.create = this.create.bind(this)
  }

  async tQuery (t, exampleName, query) {
    if (arguments.length !== 3) {
      throw new Error("Expecting 3 arguments for tQuery. Did you forgot exampleName?")
    }
    query = functionReturn(query)
    //console.log(JSON.stringify(query, null, 2))
    return await this.query(query)
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

