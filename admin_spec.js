require('dotenv').config();
const frisby = require('frisby');

const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const dbName = 'db-api-test'
const dbNameBody = '"' + dbName + '"'

let dbSecret = null

frisby.create('Get Karma Version')
  .get(KARMA_ENDPOINT)
  .inspectBody()
  .expectStatus(200)
  .toss();

frisby.create('create db with invalid name')
  .post(KARMA_ENDPOINT + '/root/create_db', null,
    {
      json: false,
      body: 'db-kl-öäü-op'
    }
  )
  .addHeader('X-Karma-Secret', KARMA_INSTANCE_SECRET)
  .addHeader('X-Karma-Codec', 'json')
  .expectStatus(400)
  .after(function (err, res, body) {
    console.log("****************************************************************************************************")
    console.log("/root/create_db")
    console.log(body)
  })
  .toss();


createDb();


function createDb () {
  frisby.create('create db')
    .post(KARMA_ENDPOINT + '/root/create_db', null,
      {
        json: false,
        body: dbNameBody
      }
    )
    .addHeader('X-Karma-Secret', KARMA_INSTANCE_SECRET)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .after(function (err, res, body) {
      console.log("****************************************************************************************************")
      console.log("/root/create_db")
      console.log(body)
      dbSecret = body.secret
      createSameDbAgain();
    })
    .toss();
}

function createSameDbAgain () {
  frisby.create('try to create the same db again')
    .post(KARMA_ENDPOINT + '/root/create_db', null,
      {
        json: false,
        body: dbNameBody
      }
    )
    .addHeader('X-Karma-Secret', KARMA_INSTANCE_SECRET)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(500)
    .after(function (err, res, body) {
      console.log("****************************************************************************************************")
      console.log("/root/create_db")
      console.log(body)
      listDb();
    })
    .toss();
}

function listDb () {
  frisby.create('list dbs')
    .get(KARMA_ENDPOINT + '/root/list_dbs')
    .addHeader('X-Karma-Secret', KARMA_INSTANCE_SECRET)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .after(function (err, res, body) {
      console.log("****************************************************************************************************")
      console.log("/root/list_dbs")
      console.log(body)
      // jasmine-style assertion
      expect(body).toContain(dbName);
      deleteDb();
    })
    .toss();
}

function deleteDb () {
  frisby.create('delete db')
    .post(KARMA_ENDPOINT + '/root/delete_db', null,
      {
        json: false,
        body: dbNameBody
      }
    )
    .addHeader('X-Karma-Secret', KARMA_INSTANCE_SECRET)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .after(function (err, res, body) {
      console.log("****************************************************************************************************")
      console.log("/root/delete_db")
      console.log(body)
    })
    .toss();
}


// frisby.create('Get Karma Tags')
//   .post('https://dev-api.karma.run',
//     {
//       "all": {
//         "tag": {"string": "_tag"}
//       }
//     }, {json: true})
//   .addHeader('X-Karma-Signature', dbSecret)
//   .addHeader('X-Karma-Database', 'api-test')
//   .addHeader('X-Karma-Codec', 'json')
//   .addHeader('Expect', '')
//   .inspectBody()
//   .expectStatus(200)
//   .toss();
//
// frisby.create('Get Karma Tags')
//   .post('https://dev-api.karma.run',
//     {
//       "all": {
//         "tag": {
//           "string": "_model"
//         }
//       }
//     }
//     , {json: true})
//   .addHeader('X-Karma-Signature', dbSecret)
//   .addHeader('X-Karma-Database', 'api-test')
//   .addHeader('X-Karma-Codec', 'json')
//   .addHeader('Expect', '')
//   .inspectBody()
//   .expectStatus(200)
//   .toss();
