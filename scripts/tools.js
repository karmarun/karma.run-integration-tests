const fs = require('fs')
const {spawn, exec} = require('child_process')

exports.wait = function (sec) {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000)
  })
}

exports.execCommand = function (command, silent = false) {
  return new Promise((resolve, reject) => {
      if (!silent) {
        console.log(`RUN COMMAND: ${command}`)
      }
      exec(command, function (error, stdout, stderr) {
        if (error) {
          reject(error)
        }
        else {
          if (!silent) {
            console.log(stdout)
          }
          resolve(stdout)
        }
      })
    }
  )
}

exports.spanProcess = function (command, args) {
  return new Promise((resolve, reject) => {
      const pawnedProcess = spawn(command, args, {
        cwd: process.cwd(),
        stdio: 'inherit', // child process will use parent's std io's
        shell: true // useful to support double quotes in commands
      })

      pawnedProcess.on('close', (code) => {
        if (code === 0) {
          resolve(code)
        }
        else {
          reject(code)
        }
      })
    }
  )
}

exports.writePlainFile = function (filePath, plainText) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(filePath, plainText, function (error) {
      if (error) {
        return reject(error)
      }
      else {
        resolve(true)
      }
    })
  })
}

exports.writeFile = function (filePath, json) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(filePath, JSON.stringify(json, null, 2), function (error) {
      if (error) {
        return reject(error)
      }
      else {
        resolve(true)
      }
    })
  })
}

exports.askUSer = function (question) {
  return new Promise(function (resolve) {
    const readLine = require('readline')

    const rl = readLine.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}


module.exports = exports