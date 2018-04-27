const fetch = require('isomorphic-fetch')
const https = require('https')
const http = require('http')
const fs = require('fs')
const exec = require('child_process').exec
const {URL} = require('url');

URL.prototype.getPort = function () {
  if (this.port) {
    return this.port
  }
  else {
    return this.protocol === 'https:' ? '443' : '80'
  }
}

exports.KarmaTools = class {

  constructor (endpoint) {
    this.signature = null
    this.endpoint = new URL(endpoint)
  }


  instanceAdministratorRequest (url) {
    return new Promise((resolve, reject) => {

      const headers = new Headers();
      headers.append("X-Karma-Codec", "json")
      headers.append("X-Karma-Signature", this.signature)

      let options = {
        method: 'POST',
        headers: headers,
      }

      fetch(this.endpoint.toString() + url, options)
        .then(function (response) {
          return new Promise(function (resolve) {
            response.json().then(function (result) {
              resolve({body: result, status: response.status, statusText: response.statusText})
            })
          })
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (ex) {
          reject(ex)
        });
    })
  }


  hasSession () {
    return !!(this.signature)
  }

  signOut () {
    this.signature = null
  }

  /**
   * sign in as instance administrator
   * @returns {Promise}
   */
  async signIn (username, password) {

    const headers = new Headers();
    headers.append("X-Karma-Codec", "json")

    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        "username": username,
        "password": password
      })
    }

    const response = await fetch(this.endpoint.toString() + 'auth', options)
    const bodyString = await response.text()
    let result = null
    try {
      result = JSON.parse(bodyString)
    } catch (e) {
      e.jsonString = bodyString
      console.log("****************************************************************************************************")
      console.log("Result Body")
      console.log("****************************************************************************************************")
      console.log(bodyString)
      throw e
    }

    this.signature = result
    return this.signature
  }


  /**
   * @param query
   * @returns {Promise}
   */
  async query (query) {
    if (!this.hasSession()) {
      throw new Error('no session')
    }
    const headers = new Headers();
    headers.append("X-Karma-Codec", "json")
    headers.append("X-Karma-Signature", this.signature)

    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(query)
    }

    const response = await fetch(this.endpoint.toString(), options)
    const bodyString = await response.text()
    let result = null
    try {
      result = JSON.parse(bodyString)
    } catch (e) {
      e.jsonString = bodyString
      console.log("****************************************************************************************************")
      console.log("Result Body")
      console.log("****************************************************************************************************")
      console.log(bodyString)
      throw e
    }
    return {body: result, status: response.status, statusText: response.statusText}
  }


  async getTags () {
    const tags = await this.query(
      [
        "all", [
        "tag", ["string", "_tag"]
      ]
      ]
    )
    return tags.body.reduce((pref, tagObject) => {
      pref[tagObject.tag] = tagObject.model
      return pref
    }, {})
  }


  exportDb (destination) {
    if (!this.hasSession()) {
      throw new Error('no session')
    }

    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.endpoint.hostname,
        port: this.endpoint.getPort(),
        path: '/admin/export',
        method: 'GET',
        headers: {
          'X-Karma-Codec': 'json',
          'X-Karma-Signature': this.signature,
        }
      }

      console.log(options)
      const writeStream = fs.createWriteStream(destination)
      const httpObject = this.endpoint.protocol === 'https:' ? https : http

      const req = httpObject.request(options, (res) => {
        res.pipe(writeStream)
        writeStream.on('finish', function () {
          writeStream.close()
          resolve(destination + ' saved!')
        })
      })

      req.on('error', (e) => {
        reject(e)
      })
      req.end()
    })
  }

  importDb (dumpFile) {
    return new Promise((resolve, reject) => {
        const command = 'curl -vvX POST -H "X-Karma-Signature: ' + this.signature + '" -H "X-Karma-Codec: json" -H "Expect: "  --data-binary @' + dumpFile + ' ' + this.endpoint.href + 'admin/import';
        console.log(command);
        exec(command, function (error, stdout, stderr) {
          if (error !== null) {
            console.log('exec error: ' + error)
            reject(error)
          }
          else {
            console.log('stdout:', stdout)
            console.log('stderr:', stderr)
            resolve('restoreDb success')
          }
        })
      }
    )
  }

}
