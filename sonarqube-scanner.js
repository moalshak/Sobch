import scanner from 'sonarqube-scanner';

scanner(
    {
        serverUrl: "http://localhost:9000",
        token: "sqp_3421a2864edd6818b20c0d3226379fe7a89eeaa7",
        options: {
            "sonar.projectName" : "SOBCH",
            "sonar.sources": "./",
            "sonar.exclusions" : ["genDevices.js", "main.js"]
        }
    },
    () => process.exit()
);