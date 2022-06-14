import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();


/**
 * IDs of the admins
 */
 const ADMINS = [
    "VfULdqBkeYXXtjP0xK6lVvYQTIW2", // mohammad
    "1CUMvWFlucbIddCwslwEsY5qlQb2", // carmen
    "yDU8z6Mizch1g4PMQHvWseYD8yF3", // dhruv
    "a2szgwUYHnUMInbc6cdiwXHeUN73", // selim
    "9GJaxXLYP5SaQDurokIpX2Yu79v1", // fergal
]

/**
 * 
 * @param {string} id the id to test
 * @returns 
 */
function isAdmin(id) {
	return ADMINS.includes(id);
}

/***
 * users
 * 	- key : user.uid
 *  - value : the firebase user object
 */
let users = {}, API_KEY = [process.env.API_KEY];

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
let loggers = {};

/**
 * Winston logger.
 */
let Log = new (winston.Container)({
	transports: [
		new (winston.transports.Console)({
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
	let that = this,
		meta = {module: name}, idx = 0,
		args = Array.prototype.slice.call(arguments, 3);
		
	args.forEach(function(m){
		let ret;
		
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
let getLog = function (name) {
	if(!name){
		return undefined;
	}
	
	// check if the logger already exists
	if(loggers[name]){
		return loggers[name];
	}
	
	let ret = Log.add(name, {

	});
	if (process.env.NODE_ENV === 'production') {
		ret = Log.add(
			new (winston.transports.File)({
				name: `${name}`,
				filename: `./logs/info/${name}.log`,
				level: 'info',
				timestamp: function(){return Date.now();},
				options: {flags: 'a+'},
				formatter: function(options) {
					// Returned string will be passed to the logger
					return options.timestamp() + ' ' + options.level + ' ' + 
					options.message + ' ' + JSON.stringify(options.meta);
				},
				json: true
			}),
			new (winston.transports.File)({
				name: `${name}`,
				filename: `./logs/error/${name}_error.log`,
				level: 'error',
				options: {flags: 'a+'},
				timestamp: function(){return Date.now();},
				formatter: function(options) {
					// Returned string will be passed to the logger
					return options.timestamp() + ' ' + options.level + ' ' + 
					options.message + ' ' + JSON.stringify(options.meta);
				},
				json: true
			})
		)
	}

	for (let level in ret.levels) {
		ret[level] = addLog.bind(ret, name, level);
	}
		
	loggers[name] = ret;
	
	return ret;
}


function getFromEnv(variable, jsonFormatted = false) {
	let envVar = process.env[variable];
	if (envVar) {
		if (jsonFormatted) {
			try {
				envVar = JSON.parse(envVar);
			} catch(error) {
				if (error instanceof SyntaxError) {
					getLog('config').error(`The variable: ${variable} is not correct JSON, try to stringify it`);
					process.exit(1);
				} else {
					console.error(error);
				}
			}
		}
		getLog('config').info(`Using ${variable} from environment variable`);
		return envVar;
	} else {
		getLog('config').error(`Environmental Variable: ${variable} is not set in your .env`);	
		process.exit(1);
	}
}

/**
 * the firebase config which should be save in the .env file.
 */
const FIRE_BASE_CONFIG = getFromEnv("FIRE_BASE_CONFIG", true);

/**
 * The fire base service account (ADMIN SDK)
 */
const SERVICE_ACCOUNT = getFromEnv("SERVICE_ACCOUNT", true);

/**
 * the port to listen on should be specified in the .env file.
 */
const PORT = process.env.PORT || 8000;

/**
 * The general email used to notify users
 */
const EMAIL = getFromEnv("EMAIL");

/**
 * The password for that email  && test password
 */
const PASSWORD = getFromEnv("PASSWORD");

/**
 * Password used for an account used for testing
 * */
const ACC_PASSWORD = getFromEnv("ACC_PASSWORD");

/**
 * Password used for testing
 * */
const TEST_PASSWORD = getFromEnv("TEST_PASSWORD");

/**
 * another account password
 * */
const ACC_PASSWORD2 = getFromEnv("ACC_PASSWORD2");

/**
 * example of a weak password
 * */
const WEAK_PASSWORD = getFromEnv("WEAK_PASSWORD");


/**
 * export stuff needed by other files
 */
export {
    getLog,
	FIRE_BASE_CONFIG,
	SERVICE_ACCOUNT,
	addUser,
	getUser,
	removeUser,
	PORT,
	EMAIL,
	PASSWORD,
	API_KEY,
	isAdmin,
	ACC_PASSWORD,
	TEST_PASSWORD,
	ACC_PASSWORD2,
	WEAK_PASSWORD,

};