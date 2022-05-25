import winston from 'winston';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();


/***
 * users
 * 	- key : user.uid
 *  - value : the firebase user object
 */
var users = {};

/**
 * 
 * @param {String} uid 
 * @returns {Object} the user object that has the given uid
 */
function getUser(uid) {
	return users[uid];
}


/**
 * Adds the given user to the users object.
 * @param {Object} user 
 */
function addUser(user) {
	users[user.uid] = user;
}

/**
 * Deletes the user from the users object.
 * 
 * @param {String} user the uid of the user to delete
 */
function removeUser(user) {
	delete users[user.uid];
}


/**
 * loggers array to store all the loggers.
 */
var loggers = {};

/**
 * Winston logger.
 */
var Log = new (winston.Container)({
	transports: [
		new (winston.transports.Console)({
			timestamp: () => {new Date().toISOString();},
			color: true,
			stringify: true,
			json: false,
			prettyPrint: JSON.stringify,
			level: 'debug'
		})
	]
});

/**
 * Logs the given message to the named logger at the given level.
 * 
 * @param {String} name Name of the winston logger 
 * @param {String} level Level of the log. See {@link https://github.com/winstonjs/winston}
 * @param {String} msg Message to log
 * @param {args} Object or array of objects that will get logged as well. 
 *               If the object has a toLog() function, it gets called as well.
 * @return {Object} Result of winston log. Don't use.
 */
 function addLog(name, level, msg){
	var that = this,
		meta = {module: name}, idx = 0,
		args = Array.prototype.slice.call(arguments, 3);
		
	args.forEach(function(m){
		var ret;
		
		if(m && typeof m.toLog === 'function'){
			ret = m.toLog();
		}else{
			ret = [idx++, m];
		}
		
		if(!ret || ret.length < 2){
			that.log('error', "Invalid return from toLog", {
				module: 'config',
				subject: (m ? m.constructor.name : m),
				ret: ret
			});
		}else{
			meta[ret[0]] = ret[1];
		}
	});

	if(args.length === 1 && meta[0] && typeof meta[0] === 'object'){
		meta = meta[0];
		meta.module = name;
	}
	
	return this.log(level, msg, meta);	
}

/**
 * Get the logger for the given name.
 * 
 * @param {String} name  the name of the logger
 * @returns {winston.Logger} the logger
 */
var getLog = function (name) {
	if(!name){
		return Log;
	}
	
	// check if the logger already exists
	if(loggers[name]){
		return loggers[name];
	}
	
	var ret = Log.add(name, {
		file: {
			json: true,
			filename: path.join(`logs/${name}.log`),
			options: {flags: 'a+'}
		}
	});
	
	for (var level in ret.levels) {
		ret[level] = addLog.bind(ret, name, level);
	}
		
	loggers[name] = ret;
	
	return ret;
}

/**
 * the firebase config which should be save in the .env file.
 */
const FIRE_BASE_CONFIG = JSON.parse(process.env.FIRE_BASE_CONFIG);

/**
 * The fire base service account (ADMIN SDK)
 */
const SERVICE_ACCOUNT = JSON.parse(process.env.SERVICE_ACCOUNT);

/**
 * the port to listen on should be specified in the .env file.
 */
const PORT = process.env.PORT || 8000;

/**
 * export stuff needed by other files
 */
export default {
    getLog: getLog,
	FIRE_BASE_CONFIG: FIRE_BASE_CONFIG,
	SERVICE_ACCOUNT : SERVICE_ACCOUNT,
	addUser : addUser,
	getUser : getUser,
	removeUser : removeUser,
	PORT: PORT
};