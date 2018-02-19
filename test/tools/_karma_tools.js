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
    this.karmaDbName = null
    this.signature = null
    this.endpoint = new URL(endpoint)
  }

  /**
   * actions which only instance administrators can execute
   * @param url
   * @param method
   * @param karmaInstanceSecret
   * @param dbName
   * @returns {Promise}
   */
  instanceAdministratorRequest (url, method, karmaInstanceSecret, dbName) {
    return new Promise((resolve, reject) => {

      const headers = new Headers();
      headers.append("X-Karma-Secret", karmaInstanceSecret)
      headers.append("X-Karma-Codec", "json")

      let options = {
        method: method,
        headers: headers,
      };

      if (dbName) {
        options['body'] = `"${dbName}"`
      }

      console.log(this.endpoint.toString() + url)
      console.log(karmaInstanceSecret)

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


  instanceAdministratorRequestKBullshit (url) {
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
    this.karmaDbName = null
    this.signature = null
  }

  /**
   * sign in as instance administrator
   * @returns {Promise}
   */
  async signIn (karmaDbName, username, password) {
    this.karmaDbName = karmaDbName

    const headers = new Headers();
    headers.append("X-Karma-Database", this.karmaDbName)
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
    const result = await response.json()
    if (response.status !== 200) {
      throw new Error(result)
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
    headers.append("X-Karma-Database", this.karmaDbName)
    headers.append("X-Karma-Codec", "json")
    headers.append("X-Karma-Signature", this.signature)

    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(query)
    }

    const response = await fetch(this.endpoint.toString(), options)
    const result = await response.json()
    return {body: result, status: response.status, statusText: response.statusText}
  }


  async getTags () {
    const tags = await this.query(
      {
        "all": {
          "tag": "_tag"
        }
      }
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
          'X-Karma-Database': this.karmaDbName,
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
        const command = 'curl -vvX POST -H "X-Karma-Database: ' + this.karmaDbName + '" -H "X-Karma-Signature: ' + this.signature + '" -H "X-Karma-Codec: json" -H "Expect: "  --data-binary @' + dumpFile + ' ' + this.endpoint.href + 'admin/import';
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


  /**
   * Uploads all fixtures defined in the given folder
   * @param {string} sourceDirectory
   * @returns {Promise}
   */
  uploadFixtures (sourceDirectory) {
    return new Promise((resolve, reject) => {
        const command = 'DISABLE_HTTP2=1 ' + __dirname + '/binTools/' + getTool('fixtures') + ' --directory "' + sourceDirectory + '" --endpoint "' + this.endpoint.href + '" --database "' + this.karmaDbName + '" --signature "' + this.signature + '"';
        console.log("****************************************************************************************************");
        console.log('command:');
        console.log(command);
        console.log("****************************************************************************************************");
        exec(command, function (error, stdout, stderr) {
          console.log("****************************************************************************************************");
          console.log('stderr:');
          console.log(stderr);
          console.log("****************************************************************************************************");
          console.log('stdout:');
          console.log(stdout);
          if (error !== null) {
            reject(error)
          }
          else {
            resolve('uploadFixtures success')
          }
        })
      }
    )
  }
}


function getTool (tool) {
  let arch = ''
  switch (process.arch) {
    case 'x64':
      arch = 'amd64'
      break;
    case 'ia32':
      arch = '386'
      break;
    case 'arm':
      throw new Error('not supported')
      break;
  }

  let platform = '';
  switch (process.platform) {
    case 'darwin':
      platform = 'darwin'
      break;
    case 'freebsd':
      throw new Error('not supported')
      break;
    case 'linux':
      platform = 'linux'
      break;
    case 'sunos':
      throw new Error('not supported')
      break;
    case 'win32':
      throw new Error('not supported')
      break;
  }


  return tool + '-' + platform + '-' + arch
}