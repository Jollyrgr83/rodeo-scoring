class Api {
    base;
    constructor() {
        this.set();
    }
    set() {
        this.base = (process.env.REACT_APP_SERVER_URL === undefined) ? "http://localhost:5000/api" : process.env.REACT_APP_SERVER_URL;
    }
    /* default get all routes */
    get(stub) {
        return this.base + "/" + stub + "/all/";
    }
    /* default get one item by id routes */
    getOne(stub, id) {
        return this.base + "/" + stub + "/one/" + id;
    }
    /* delete, post, put routes */
    use(stub) {
        return this.base + "/" + stub + "/";
    }
    getCompetitionTiers() {
        return this.base + "/competitionTier/full/";
    }
    getOpenCompetitionTiers() {
        return this.base + "/competitionTier/open/";
    }
    getNamedCompetitionTiers() {
        return this.base + "/competitionTier/named/";
    }
    getCompetitors() {
        return this.base + "/competitor/many/yearID/";
    }
    getScoresByCompetitor() {
        return this.base + "/score/competitorID/";
    }
    reconcile() {
        return this.base + "/score/reconcile/";
    }
    getActiveOrganizations() {
        return this.base + "/organization/active/yearID/";
    }
    getActiveCompetitionTiers(year, organization) {
        return this.base + "/competitionTier/active/yearID/" + year + "/organizationID/" + organization;
    }
    getActiveCompetitionEvents(year, competitionTier) {
        return this.base + "/competitionEvent/active/yearID/" + year + "/competitionTierID/" + competitionTier;
    }
    getReport(y, r, o, c, e) {
        return this.base + "/score/report/yearID/" + y + "/reportType/" + r + "/organizationID/" + o + "/competitionTierID/" + c + "/eventID/" + e;
    }
}
export default Api;