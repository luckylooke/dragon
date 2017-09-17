const { exec } = require('child_process')
const path = require('path')
const packagesFolder = path.join( __dirname, '/../packages/' )
const fs = require('fs');

fs.readdir(packagesFolder, (err, files) => {

  files.forEach(file => {

    console.log('starting build for: ', file, 'package')

    exec( 'webpack && npm version patch && npm publish', 
    	{
	    	cwd: path.join(packagesFolder, file, '/')
	    }, 
	    (err, stdout, stderr) => {
			if (err) {
			    // node couldn't execute the command
			    console.error(err)
			    return;
			}

		  // the *entire* stdout and stderr (buffered)
		  console.log(`stdout: ${stdout}`);
		  console.log(`stderr: ${stderr}`);
		}
	);
  });
})
