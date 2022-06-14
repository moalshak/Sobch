import scanner from 'sonarqube-scanner';
import dotenv from 'dotenv';
dotenv.config();

scanner(
    {
        serverUrl: "http://localhost:9000",
        options: {
            "sonar.projectName" : "SOBCH",
            "sonar.host.url" : "http://localhost:9000",
            "sonar.login" : "admin",
            "sonar.password" : process.env.SONAR_PW,
            "sonar.sources": "./",
            "sonar.exclusions" : "test/*, scripts/genDevices.js, simulation/main.js, lib/notifyUser.js, sonarqube-scanner.js",
            "sonar.coverage.exclusions" : "scripts/genDevices.js, simulation/main.js",
            "sonar.tests" : "test",
            "sonar.javascript.lcov.reportPaths" : "coverage/lcov.info",
            "sonar.javascript.xunit.reportPaths" : "coverage/xunit.xml",
            "sonar.javascript.clover.reportPaths" : "coverage/clover.xml",
            "sonar.clover.reportPaths" : "coverage/clover.xml",
        }
    },
    () => process.exit()
);