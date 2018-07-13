const request = require('request')
const unzip = require('unzip')
const csv = require('csvtojson')
const fs = require('fs-extra')
const path = require('path')
const domains = []

const save = () => {
  let dest = path.join(__dirname, 'websites.json')
  return fs.writeJson(dest, domains)
}

request.get('http://s3.amazonaws.com/alexa-static/top-1m.csv.zip')
  .pipe(unzip.Parse())
  .on('entry', function (entry) {
    entry.pipe(csv()).subscribe(row => {
      if (domains.length > 1e5) {
        entry.pause()
        save()
          .then(() => {
            process.exit(0)
          })
      } else {
        let domain = row.google.com
        domains.push(domain)
      }
    })
  })

