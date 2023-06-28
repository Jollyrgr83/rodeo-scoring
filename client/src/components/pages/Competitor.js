import {useEffect, useState} from "react";

import "../shared/util.css";

import Api from "../classes/api";

import {useHttp} from "../hooks/http";

import Main from "../shared/Main";
import Section from "../shared/Section";
import Subtitle from "../shared/Subtitle";
import Line from "../shared/Line";
import CompetitorAdd from "./competitor components/CompetitorAdd";
import Select from "../shared/Select";
import CompetitorView from "./competitor components/CompetitorView";
import LoadingAnimation from "../shared/LoadingAnimation";
import Message from "../shared/Message";

const Competitor = () => {
    const API = new Api();
    const {sendRequest} = useHttp();

    const [isCompetitorsEmpty, setIsCompetitorsEmpty] = useState(false);
    const [isTiersEmpty, setIsTiersEmpty] = useState(false);

    const [loadedYears, setLoadedYears] = useState();
    const [loadedOrganizations, setLoadedOrganizations] = useState();
    const [loadedCompetitors, setLoadedCompetitors] = useState();
    const [loadedTiers, setLoadedTiers] = useState();

    const [refreshLoadedCompetitors, setRefreshLoadedCompetitors] = useState(false);
    const [refreshLoadedTiers, setRefreshLoadedTiers] = useState(false);
    const [refreshLoadedOrganizations, setRefreshLoadedOrganizations] = useState(false);

    const [selectedYearValue, setSelectedYearValue] = useState();
    const [selectedTierValue, setSelectedTierValue] = useState();
    const [selectedTierType, setSelectedTierType] = useState();
    const [selectedCompetitor, setSelectedCompetitor] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [isYearsLoading, setIsYearsLoading] = useState(true);
    const [isCompetitorsLoading, setIsCompetitorsLoading] = useState(true);
    const [isOrganizationsLoading, setIsOrganizationsLoading] = useState(true);
    const [isTiersLoading, setIsTiersLoading] = useState(true);

    const [message, setMessage] = useState("");
    const [messageState, setMessageState] = useState(false);

    /* retrieve years */
    useEffect(() => {
        const getYears = async () => {
            try {
                const years = await sendRequest(API.get("year"));
                setLoadedYears(years);
                setSelectedYearValue(years[0]._id);
                setIsYearsLoading(false);
            } catch (er) {
                console.log(er.message);
            }
        }
        getYears();
    }, []);

    /* once years retrieved and set, retrieve competitors */
    useEffect(() => {
        const getCompetitors = async () => {
            try {
                setIsCompetitorsLoading(true);
                const competitors = await sendRequest(API.getCompetitors() + selectedYearValue);
                if (competitors[0].noCompetitor) {
                    setIsCompetitorsEmpty(true);
                } else {
                    setSelectedCompetitor(competitors[0]);
                    setIsCompetitorsEmpty(false);
                }
                setLoadedCompetitors(competitors);
                setRefreshLoadedCompetitors(false);
                setIsCompetitorsLoading(false);
            } catch (er) {
                console.log(er.message);
            }
        }
        if (selectedYearValue) {
            getCompetitors();
        }
    }, [refreshLoadedCompetitors, selectedYearValue, sendRequest]);

    /* retrieves and sets organizations */
    useEffect(() => {
        const getOrganizations = async () => {
            try {
                const organizations = await sendRequest(API.get("organization"));
                setLoadedOrganizations(organizations);
                setRefreshLoadedOrganizations(false);
                setIsOrganizationsLoading(false);
            } catch (er) {
                console.log(er.message);
            }
        }
        getOrganizations();
    }, [sendRequest, refreshLoadedOrganizations]);

    /* once years retrieved and set, retrieve tiers */
    useEffect(() => {
        const getTiers = async () => {
            try {
                const tiers = await sendRequest(API.getNamedCompetitionTiers() + selectedYearValue);
                setLoadedTiers(tiers);
                if (tiers[0].noTier) {
                    setIsTiersEmpty(true);
                } else {
                    setIsTiersEmpty(false);
                    setSelectedTierValue(tiers[0]._id);
                    setSelectedTierType(tiers[0].teamBoolean);
                }
                setRefreshLoadedTiers(false);
                setIsTiersLoading(false);
            } catch (er) {
                console.log(er.message);
            }
        }
        if (selectedYearValue) {
            getTiers();
        }
    }, [selectedYearValue, sendRequest, refreshLoadedTiers]);

    useEffect(() => {
        setIsLoading(isYearsLoading || isCompetitorsLoading || isOrganizationsLoading || isTiersLoading);
    }, [isYearsLoading, isCompetitorsLoading, isOrganizationsLoading, isTiersLoading]);

    const yearSelectHandler = e => setSelectedYearValue(e.target.value);
    const competitorSelectHandler = e => {
        loadedCompetitors.forEach(c => {
            if (c._id === e.target.value) {
                setSelectedCompetitor(c);
            }
        });
    }
    const updateCompetitorHandler = data => {
        if (data.action === "update") {
            sendRequest(API.use("competitor"), "PUT", data).then(r => {
                if (r.message && r.message === "success") {
                    setRefreshLoadedCompetitors(true);
                    msg("Success! Competitor has been updated.");
                } else {
                    msg("Something went wrong. Please try again.");
                }
            });
        }
        if (data.action === "delete") {
            sendRequest(API.use("competitor"), "DELETE", data).then(r => {
                if (r.message && r.message === "success") {
                    setRefreshLoadedCompetitors(true);
                    msg("Success! Competitor has been removed.");
                } else {
                    msg("Something went wrong. Please try again.");
                }
            });
        }
    }
    const addCompetitorTierSelectHandler = e => {
        setSelectedTierValue(e.target.value);
        loadedTiers.forEach(tier => {
            if (tier._id === e.target.value) {
                setSelectedTierType(tier.teamBoolean);
            }
        });
    }
    const addCompetitorHandler = data => {
        data.tierID = selectedTierValue;
        data.yearID = selectedYearValue;
        sendRequest(API.use("competitor"), "POST", data).then(r => {
            if (r.message && r.message === "success") {
                setRefreshLoadedCompetitors(true);
                setRefreshLoadedTiers(true);
                setRefreshLoadedOrganizations(true);
                msg("Success! Competitor has been added.");
            } else {
                msg("Something went wrong. Please try again.");
            }
        });
    }
    const msg = txt => {
        setMessage(txt);
        setMessageState(true);
    }
    const closeModal = () => setMessageState(false);

    return (
        <Main>
            <Section>
                <Subtitle text={"Competition Year"} />
                <Line type={"large"} />
                {!isYearsLoading && (
                    <select className={"full ctr-x"} onChange={yearSelectHandler}>
                        {loadedYears.map(year => {
                            return <option key={year._id} value={year._id}>{year.name}</option>
                        })}
                    </select>
                )}
            </Section>

            <Section>
                <Subtitle text={"View / Edit Competitors"}/>
                <Line type={"full"} />
                {!isCompetitorsLoading && !isYearsLoading && (
                    <Subtitle text={"Select a competitor"}/>
                )}
                <Select className={"full ctr-x"} onChange={competitorSelectHandler}>
                    {!isCompetitorsLoading && !isYearsLoading && !isCompetitorsEmpty && (
                        loadedCompetitors.map(c => {
                            if (c.firstName) {
                                return <option key={c._id} value={c._id}>{c.competitorNumber + " - " + c.firstName + " " + c.lastName}</option>
                            } else {
                                return <option key={c._id} value={c._id}>{c.competitorNumber + " - " + c.teamName + ": " + c.groupNames}</option>
                            }
                        }))}
                    {isCompetitorsEmpty && (
                        <option value={"0"}>Add a competitor below</option>
                    )}
                </Select>
                {!isCompetitorsLoading && !isCompetitorsEmpty && (
                    <CompetitorView competitor={selectedCompetitor} organizations={loadedOrganizations} updateCompetitorHandler={updateCompetitorHandler}/>
                )}
            </Section>

            <Section id={"add-section"}>
                <Subtitle text={"Add Competitors"} />
                <Line type={"full"} />
                <Subtitle text={"Select Competition Tier"} />
                <select className={"full ctr-x"} onChange={addCompetitorTierSelectHandler} value={selectedTierValue}>
                    {isTiersEmpty && (
                        <option value={"0"}>Add a competition tier on the year setup page</option>
                    )}
                    {!isTiersEmpty && !isTiersLoading && (loadedTiers.map(t => {
                        return <option key={t._id} value={t._id}>{t.name}</option>
                    }))}
                </select>

                {!isTiersEmpty && !isTiersLoading && !isOrganizationsLoading && (
                    <CompetitorAdd organizations={loadedOrganizations} tierType={selectedTierType} addCompetitorHandler={addCompetitorHandler} msgHandler={msg}/>
                )}
            </Section>
            <LoadingAnimation state={isLoading}/>
            <Message text={message} state={messageState} closeModal={closeModal}/>
        </Main>
    );
}
export default Competitor;