/* global require, __dirname,  */
const path = require('path')
const fs = require('fs-extra')

let source = path.resolve( __dirname, '../dragon-web/dist')
let destination = path.resolve( __dirname, '../docs')

// copy source folder to destination
fs.copy(source, destination)
  .then(() => {
    source = path.resolve( __dirname, '../packages/core/dragon.css')
    destination = path.resolve( __dirname, '../dist/dragon.css')
    return fs.copy(source, destination)
  })
  .then(() => console.log('Copy docs completed!'))
  .catch( err => {
    console.log('An error occured while copying docs.')
    return console.error(err)
  })
