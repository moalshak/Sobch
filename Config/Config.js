import winston from 'winston';
import path from 'path';

var loggers = [];

/**
 * Get the timestamp in the format for winston.
 * 
 * @return {String} The formatted timestamp 
 */
 function timestamp(){
	var d = new Date();
	return d.toISOString();
}

var Log = new (winston.Container)({
	transports: [
		new (winston.transports.Console)({
			timestamp: timestamp,
			color: true,
			stringify: true,
			json: false,
			prettyPrint: JSON.stringify,
			level: 'debug'
		})
	]
});

var getLog = function (name) {
    if(!name){
		return Log;
	}
	
	if(loggers.hasOwnProperty(name)){
		return loggers[name];
	}
	
	var ret = Log.add(name, {
		file: {
			json: true,
			filename: path.join(`logs/${name}.log`),
			options: {flags: 'a+'}
		}
	});
	
		
	loggers[name] = ret;
	
	return ret;
}

var paths = {
	root: path.join(process.cwd(), '..'),
}

// export the getLog function
export default {
    getLog: getLog,
	path : paths
};