import winston from 'winston';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

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
// const SERVICE_ACCOUNT = JSON.parse(process.env.SERVICE_ACCOUNT);
const SERVICE_ACCOUNT={"type":"service_account","project_id":"hip-informatics-307918","private_key_id":"40cda2bfb0db287b596571783dee18bbf6b99e85","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC9t6U7Ix8nmuJE\nvNJKN6m19vo7rRo4WL19v5R4+RLwUsgXd7ETIvPVPIgFla2RJaJVmuwokQ1pJwcZ\nSA4tVVZSkhYRkQ/1EoW0N6Y0OR0YOTYoahqKpacARQmsm4E9Pv9IxV5zlHE4hoIW\nBqxCw2gUJPMzKT6+KVo32aPeUOIt3UqIcTFmGRXn/umi9OxzR0oWarpG54Vxbzbe\nCYWWtWfxBVVp1f88h74ixa0xsMZXtsClXTAR/jkL4RyUuP7bBgacwfGVWdT/3f0c\ng26zkLZ+3VQn4E2sxFs7rrZ9O15uXfkB7rXbovYwHFgX5FOaffU1CVv5Iv7do0jM\nsM5aUEpZAgMBAAECggEASXgKZT3jLT+2Oz9SQoqOzthvrFeLTWHUNBPSaAyw0F+G\nfEwOR2ZkPeI8nMkLl6eW14bwyH7vzhZekeRNFTI0hTJsmG3wW4xKOfHJC/VINp7F\nQd5hG+stopWZuv3XjUPNsb05KBJGzEiOrP/1ir9ImXB7vAbPdO3nsbQ3WPtCs9aR\ne0WRNAf7Montu6iUC5fH0R9aBqyOuEKSrlQnw4r5mXwKmwsC2VYITcSF0NuJTes0\nju9vEKAfqcRC+uDx3agOjfDPVjoH/ftcE+GIXHth9iuXQzd8T6X4n2bsRB3eQ4lG\nYlSXXQ/ePtspuQPqkX/6M/aMXoUwvi86YNqoN+caNwKBgQDdJd8hzCKceu/Oxoka\nH9nPKNJGPm7AirWb/7fj4ciKklsKyS0qiclAbiFf3SoOzGpLt5a468tutIc/DEJv\n1nzSiUd/gOUJukiG9FqKLDKSvPiDCdvQ9xWg82DRRKIZf/JD2ZUpoYvyYJEQdEwj\n/kEcr+AJmEg+O/dAQPCOVlQKrwKBgQDbnbgzHxKMgVE2K518wdSQYPuSC916Rntc\nAgsQGwwnHYmvTIDjTO7xJFSesnyty62WruI1mqOzNUNfyeCW6ODliibeM2i+OCEi\nTV00svxp2wuAL+YpIOIP5rK3lST9KLpBR0lYpWbifxy4xtjC56L7xj/gtBshG9g3\n5JSrQO6ddwKBgQDWdN13ZwDBgq5/dSSLgwuzy0BvAihg66LGTyvC/7d8OgWz5fe4\n4rmZk7MlxdH9W9pQ5w5w8ajsCIGHcJoU3olZmesOCK8TyeR/iwMqL0Yz6rGMUckr\nUhFVbe8bwVT5KYyEo8H1B0Yxm9fRfxY/aVc3PI8kftrAD2Lsmo0tWyZQ3QKBgQCw\naU0ho4Ae5XH69aYYJQs+vujWNDnAkwVcrzd7xH5KnWuQKQAPlikKA4kFwZJteQMD\n249SR9nfhpWMSHnkP0UInaUDMICe7C+RgluwjWY9Eft3CQL1Xri41TQSS/fec+zJ\nqx2724F9x2Wm9/P+/FrrrCB7u7FfMyLIIxFZT1tdmQKBgES6TxHOojpg+RNXEKyo\n4D2hdvXUiAO20sPLK7+uWszGMZ/EvE33zWqTesz4ZH4wRNu2J6Acu0xnTBALGcvF\nqJQWzZ8pxdnIcfz0BItH0Y7zLGy831pJff7Tq0HbME6WhS1ENu+TfQQf/tQjOi+O\nE8fuIEOAFPMf37mOkrrZQGRZ\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xa267@hip-informatics-307918.iam.gserviceaccount.com","client_id":"106637431121810361476","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xa267%40hip-informatics-307918.iam.gserviceaccount.com"}
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
	PORT: PORT
};