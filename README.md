# Configuration Project

Web application (Dhis2 App) for MSF. DHIS2, a flexible, web-based open source information system to collect and analyze information, is being used by MSF as its HMIS. Health information coming from the projects is the reference point for medical interventions coordination, planning and monitoring and a guarantee for early and effective response in case of emergency.

The DHIS2 hierarchy in MSF is:

* International MSF
* Operational Center
* Mission
* Project
* Health Site
* Health Service

When a project opens (or changes) in MSF, the medical coordinator is the person in charge of the configuration of the HIS to be used. The Medical Coordinator is a doctor based in the capital of the country (mission level) where the project takes action. He or she does not know the internal logic of DHIS2 and IT skills can widely vary among the different missions.

The purpose of the app is to implement the configuration processes guiding the user in trough the correct data flow, as well as making transparent the different actions required (create MSF missions, projects, heallth sites, health servicers, etc...). It has been developed using AngularJS and Rest Services.

* Levels 1,2 & 3 work online, directly to the central server.
* Level 3 could lose connectivity and work offline.
* Levels 4, 5 & 6 are physically together and work in local instances of dhis2 with exactly the same metadata than the central server.

## Feedback

We’d like to hear your thoughts on the app in general, improvements, new features or any of the technologies being used. Just drop as a line at hello@eyeseetea.com and let us know! If you prefer, you can also create a new issue on our GitHub repository. Note that you will have to register and be logged in to GitHub to create a new issue.

## License

This app is licensed under GPLv3. Please respect the terms of that license.
