# Node.js URL Shortener with MongoDB

## Installation
- change url MongoDB in [`./db/mongo.js`](https://github.com/rzkyydev/short/blob/7f8e5b5eeb0444d740b4cd2760944cab6dc94f92/db/mongo.js#L4) with u url 
- change [`domain`](https://github.com/rzkyydev/short/blob/b36a8c4c3c8689f1cdfada6c279a8bbf096541a5/app.js#L13) and [`password`](https://github.com/rzkyydev/short/blob/b36a8c4c3c8689f1cdfada6c279a8bbf096541a5/app.js#L14) with u domain and password
```bash
$ git clone https://github.com/rzkyydev/shorturl-mongodb
$ cd shorturl-mongodb
$ npm install 
$ node app.js
```

***

## Basic API Usage

**Generates a Shortened URL Doc, then retrieves it for demo:**

```javascript
(async () => {
var axios = require("axios")

// generate a shortened URL.

// with random id
var shorUrl = await axios.get("https://example.com/create", {
    params: {
        url: "https://rzkyydev.site"
    }
})

// with custom id
var shorUrl = await axios.get("https://example.com/create", {
    params: {
        url: "https://rzkyydev.site",
        custom: "websiteikyy"
    }
})
console.log(shortUrl.data)
```

**Listing all Shortened URLs in DB:**

```javascript
// for view count in db
var dbShort = await axios.get("https://example.com/data")
console.log(dbShort.data)

// for view get id
var getDB = await axios.get("https://example.com/data", {
    params: {
        data: "id", // id/url/delete
        get: "MSKWOWLSPW8020JS" // id/url/delete yang ingin dicari
        password: "****" // masukin passowrd yang tersedia di ./app.js
    }
})
console.log(getDB.data)

```

**Delete Shortened URLs in DB:**

```javascript

var deleteDB = await axios.get("https://example.com/delete", {
    params: {
        id: "MSKWOWLSPW8020JS"
    }
})
console.log(getDB.data)

```

## Contribute

  1. Fork
  2. Clone forked repository
  3. Add some sweet code
  4. Add a test if adding a feature
  5. Pull Request

# Thanks to

* <a href="https://github.com/rzkyydev"><img alt="GitHub" src="https://img.shields.io/badge/rzkyydev-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white"/></a>
* <a href="https://github.com/zennn08"><img alt="GitHub" src="https://img.shields.io/badge/zennn08-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white"/></a>
* <a href="https://www.mongodb.com/"><img alt="GitHub" src="https://img.shields.io/badge/MongoDB-%23121011.svg?&style=for-the-badge&logo=mongodb&logoColor=white"/></a>

