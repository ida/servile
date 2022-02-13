#!/usr/bin/env node

// Run server of the commandline and allow passing options.


const server = require('./../lib/server')

const shortOptionNamesMap = { f: 'filesPath', p: 'port' }


function argumentsToOptions(args) {

  const options = {}

  let optionName = null

  args.shift(); args.shift()

  for(arg of args) {

    arg = arg.trim()

    if(arg.startsWith('-')) {

      arg = arg.split('-')

      optionName = arg[arg.length-1]

      if( Object.keys(shortOptionNamesMap).includes(optionName) ) {

        optionName = shortOptionNamesMap[optionName]

      }

    }

    else {

      options[optionName] = arg

    }

  }

  return options

}


const options = argumentsToOptions(process.argv)

server.serve(options)
