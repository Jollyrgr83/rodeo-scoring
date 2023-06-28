import {useEffect, useState} from "react";

import "../shared/util.css";

import Api from "../classes/api";

import {useHttp} from "../hooks/http";

import Main from "../shared/Main";
import Section from "../shared/Section";
import Subtitle from "../shared/Subtitle";
import Line from "../shared/Line";
import ReportResultContainer from "./report components/ReportResultContainer";
import ReportInvalidContainer from "./report components/ReportInvalidContainer";
import ReportLink from "./report components/ReportLink";
import LoadingAnimation from "../shared/LoadingAnimation";
import Message from "../shared/Message";
const Report = () => {
    const API = new Api();
    const {sendRequest} = useHttp();
    const reportTypes = [{value: "awards", text: "View Awards Layout (Top 3)"}, {value: "all", text: "View All Results"}];

    const [refreshScores, setRefreshScores] = useState(false);

    const [isOrganizationsEmpty, setIsOrganizationsEmpty] = useState(false);
    const [isCompetitionTiersEmpty, setIsCompetitionTiersEmpty] = useState(false);
    const [isEventsEmpty, setIsEventsEmpty] = useState(false);
    const [isScoresEmpty, setIsScoresEmpty] = useState(false);
    const [isInvalidEmpty, setIsInvalidEmpty] = useState(false);

    const [selectedYear, setSelectedYear] = useState();
    const [selectedReportType, setSelectedReportType] = useState(reportTypes[0].value);
    const [selectedOrganization, setSelectedOrganization] = useState();
    const [selectedCompetitionTier, setSelectedCompetitionTier] = useState();
    const [selectedEvent, setSelectedEvent] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [isYearsLoading, setIsYearsLoading] = useState(true);
    const [isOrganizationsLoading, setIsOrganizationsLoading] = useState(true);
    const [isCompetitionTiersLoading, setIsCompetitionTiersLoading] = useState(true);
    const [isEventsLoading, setIsEventsLoading] = useState(true);
    const [isScoresLoading, setIsScoresLoading] = useState(true);

    const [loadedYears, setLoadedYears] = useState();
    const [loadedOrganizations, setLoadedOrganizations] = useState();
    const [loadedCompetitionTiers, setLoadedCompetitionTiers] = useState();
    const [loadedEvents, setLoadedEvents] = useState();
    const [loadedScores, setLoadedScores] = useState();
    const [loadedInvalid, setLoadedInvalid] = useState();
    const [loadedCompetitionTierTitle, setLoadedCompetitionTierTitle] = useState();
    const [loadedEventTitle, setLoadedEventTitle] = useState();

    const [loadedCsvData, setLoadedCsvData] = useState();
    const [loadedPdfData, setLoadedPdfData] = useState();

    const [message, setMessage] = useState("");
    const [messageState, setMessageState] = useState(false);

    /* retrieve and set years */
    useEffect(() => {
        const getYears = async () => {
            try {
                setIsYearsLoading(true);
                const years = await sendRequest(API.get("year"));
                setLoadedYears(years);
                setSelectedYear(years[0]._id);
                setIsYearsLoading(false);
            } catch (er) {
                console.log(er.message);
            }
        }
        getYears();
    }, []);

    /* once years are set, retrieve and set active organizations */
    useEffect(() => {
        const getActiveOrganizations = async () => {
            setIsOrganizationsLoading(true);
            const organizations = await sendRequest(API.getActiveOrganizations() + selectedYear);
            if (organizations[0].empty) {
                setIsOrganizationsEmpty(true);
            } else {
                setIsOrganizationsEmpty(false);
                setSelectedOrganization(organizations[0]._id);
            }
            setLoadedOrganizations(organizations);
            setIsOrganizationsLoading(false);
        }
        if (selectedYear) {
            getActiveOrganizations();
        }
    }, [selectedYear]);

    /* once active organizations are set, retrieve active competition tiers */
    useEffect(() => {
        const getActiveCompetitionTiers = async () => {
            setIsCompetitionTiersLoading(true);
            const competitionTiers = await sendRequest(API.getActiveCompetitionTiers(selectedYear, selectedOrganization));
            if (competitionTiers[0].empty) {
                setIsCompetitionTiersEmpty(true);
            } else {
                setIsCompetitionTiersEmpty(false);
                setSelectedCompetitionTier(competitionTiers[0]._id);
            }
            setLoadedCompetitionTiers(competitionTiers);
            setIsCompetitionTiersLoading(false);
        }
        if (selectedOrganization) {
            getActiveCompetitionTiers();
        }
    }, [selectedOrganization, selectedYear]);

    /* once active competition tiers set, retrieve events */
    useEffect(() => {
        const getEvents = async () => {
            setIsEventsLoading(true);
            const events = await sendRequest(API.getActiveCompetitionEvents(selectedYear, selectedCompetitionTier));
            if (events[0].empty) {
                setIsEventsEmpty(true);
            } else {
                setIsEventsEmpty(false);
                setSelectedEvent(events[0]._id);
            }
            setLoadedEvents(events);
            setIsEventsLoading(false);
        }
        if (selectedCompetitionTier) {
            getEvents();
        }
    }, [selectedCompetitionTier, selectedOrganization, selectedYear]);

    /* once events are set, retrieve report scores and values */
    useEffect(() => {
        // setIsScoresLoading(false);
        const getScores = async () => {
            setIsScoresLoading(true);
            const scores = await sendRequest(API.getReport(selectedYear, selectedReportType, selectedOrganization, selectedCompetitionTier, selectedEvent));
            if (scores.filteredData && scores.filteredData.length > 0) {
                setIsScoresEmpty(false);
                setLoadedScores(scores.filteredData);
                setLoadedEventTitle(scores.eventName);
                setLoadedCompetitionTierTitle(scores.tierName);
                setLoadedCsvData("data:text/csv;charset=utf-8," + encodeURI(scores.csvData));
                setLoadedPdfData(scores.pdfData);
            } else {
                setIsScoresEmpty(true);
            }
            if (scores.invalid && scores.invalid.length > 0) {
                setIsInvalidEmpty(false);
                setLoadedInvalid(scores.invalid);
            } else {
                setIsInvalidEmpty(true);
            }
            setIsScoresLoading(false);
            setRefreshScores(false);
        }
        if (selectedEvent) {
            getScores();
        }
    }, [refreshScores, selectedEvent, selectedCompetitionTier, selectedOrganization, selectedReportType, selectedYear]);

    useEffect(() => {
        setIsLoading(isYearsLoading || isOrganizationsLoading || isCompetitionTiersLoading || isEventsLoading || isScoresLoading);
    }, [isYearsLoading, isOrganizationsLoading, isCompetitionTiersLoading, isEventsLoading, isScoresLoading]);

    const yearSelectHandler = e => setSelectedYear(e.target.value);
    const reportTypeSelectHandler = e => setSelectedReportType(e.target.value);
    const organizationSelectHandler = e => setSelectedOrganization(e.target.value);
    const competitionTierSelectHandler = e => setSelectedCompetitionTier(e.target.value);
    const eventSelectHandler = e => {
        setSelectedEvent(e.target.value);
        setRefreshScores(true);
    }
    const msg = txt => {
        setMessage(txt);
        setMessageState(true);
    }
    const closeModal = () => setMessageState(false);
    const downloadFile = (e) => {
        // e.preventDefault();
        // window.open("/report/retrieve-report/");
    }

    return (
        <Main>
            <Section>
                <Subtitle text={"Select Competition Year"}/>
                <Line type={"large"}/>
                <select className="full ctr-x" onChange={yearSelectHandler}>
                    {isYearsLoading && (
                        <option value={"0"}>Loading... Please wait</option>
                    )}
                    {!isYearsLoading && (
                        loadedYears.map(year => {
                            return <option key={year._id} value={year._id}>{year.name}</option>
                        })
                    )}
                </select>
                <Subtitle text={"Select Report Type"}/>
                <Line type={"large"}/>
                <select className={"full ctr-x"} onChange={reportTypeSelectHandler}>
                    {reportTypes.map(r => {
                        return <option key={r.value} value={r.value}>{r.text}</option>
                    })}
                </select>
                <Subtitle text={"Select Organization"}/>
                <Line type={"large"}/>
                <select className="full ctr-x" onChange={organizationSelectHandler}>
                    {isOrganizationsLoading && (
                        <option value={"0"}>Loading... Please wait</option>
                    )}
                    {!isOrganizationsLoading && isOrganizationsEmpty && (
                        <option value={"0"}>Add Organizations and Competitors on the competitor page</option>
                    )}
                    {!isOrganizationsLoading && !isOrganizationsEmpty && (
                        loadedOrganizations.map(org => {
                            return <option key={org._id} value={org._id}>{org.name}</option>
                        })
                    )}
                </select>
                <Subtitle text={"Select Competition Tier"}/>
                <Line type={"large"}/>
                <select className="full ctr-x" onChange={competitionTierSelectHandler}>
                    {isCompetitionTiersLoading && (
                        <option value={"0"}>Loading... Please wait</option>
                    )}
                    {!isCompetitionTiersLoading && isCompetitionTiersEmpty && (
                        <option value={"0"}>There are no competitors with this organization</option>
                    )}
                    {!isCompetitionTiersLoading && !isCompetitionTiersEmpty && (
                        loadedCompetitionTiers.map(competitionTier => {
                            return <option key={competitionTier._id} value={competitionTier._id}>{competitionTier.name}</option>
                        })
                    )}
                </select>
                <Subtitle text={"Select Event / Overall"}/>
                <Line type={"large"}/>
                <select className="full ctr-x" onChange={eventSelectHandler}>
                    {isEventsLoading && (
                        <option value={"0"}>Loading... Please wait</option>
                    )}
                    {!isEventsLoading && isEventsEmpty && (
                        <option value={"0"}>Add events for this Competition Tier on the year page</option>
                    )}
                    {!isEventsLoading && !isEventsEmpty && (
                        loadedEvents.map(ev => {
                            return <option key={ev._id} value={ev._id}>{ev.tierName + " - " + ev.name}</option>
                        })
                    )}
                </select>
            </Section>

            <Section className={"ctr-x ctr-text"}>
                {/*<a id={"print"} className={"button blue ctr-x"} href={"/api/report/retrieve-report/"} rel={"noreferrer"}>Create pdf</a>*/}
                {/*<a id={"print"} className={"button blue ctr-x"} target={"_self"} href={"/report.pdf"} rel={"noreferrer"} onClick={downloadFile}>Create pdf</a>*/}
                <ReportLink href={loadedCsvData} downloadFile={downloadFile}/>
            </Section>

            <Section>
                <Subtitle text={loadedCompetitionTierTitle}/>
                <Subtitle text={loadedEventTitle}/>
                <Line type={"full"}/>
                {isScoresLoading && !isScoresEmpty && (
                    <Subtitle text={"Loading... Please wait"}/>
                )}
                {!isScoresLoading && isScoresEmpty && (
                    <Subtitle text={"No available scores for this event."}/>
                )}
                {!isScoresLoading && !isScoresEmpty && (
                    loadedScores.map(s => {
                        let name1 = s.firstName ? s.firstName : s.teamName;
                        let name2 = s.firstName ? s.lastName : s.groupNames;
                    return <ReportResultContainer
                        key={s.competitorID}
                        place={s.place}
                        competitorNumber={s.competitorNumber}
                        firstName={name1}
                        lastName={name2}
                        organization={s.organizationName}
                        score={s.score}
                        time={s.displayTime}/>
                }))}
            </Section>

            <Section>
                <Subtitle text={"Invalid or Missing Scores"}/>
                <Line type={"full"}/>
                {isScoresLoading && !isInvalidEmpty && (
                    <Subtitle text={"Loading... Please wait"}/>
                )}
                {!isScoresLoading && isInvalidEmpty && (
                    <Subtitle text={"No invalid or missing scores for this event."}/>
                )}
                {!isScoresLoading && !isInvalidEmpty && (
                    loadedInvalid.map(i => {
                        return <ReportInvalidContainer
                            key={i.competitorID}
                            competitorNumber={i.competitorNumber}
                            missingEvents={i.invalidEvents}/>
                    }))}
            </Section>
            <LoadingAnimation state={isLoading}/>
            <Message text={message} state={messageState} closeModal={closeModal}/>
        </Main>
    );
}
export default Report;