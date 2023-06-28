import {useEffect, useState} from "react";

import "../shared/util.css";

import Api from "../classes/api";

import {useHttp} from "../hooks/http";

import Main from "../shared/Main";
import Section from "../shared/Section";
import Subtitle from "../shared/Subtitle";
import Line from "../shared/Line";
import ScoreContainer from "./score components/ScoreContainer";
import LoadingAnimation from "../shared/LoadingAnimation";
import Message from "../shared/Message";
const Score = () => {
    const API = new Api();
    const {sendRequest} = useHttp();

    const [isCompetitorsEmpty, setIsCompetitorsEmpty] = useState(false);

    const [loadedYears, setLoadedYears] = useState();
    const [loadedCompetitors, setLoadedCompetitors] = useState();
    const [loadedScores, setLoadedScores] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [isYearsLoading, setIsYearsLoading] = useState(true);
    const [isCompetitorsLoading, setIsCompetitorsLoading] = useState(true);
    const [isScoresLoading, setIsScoresLoading] = useState(true);

    const [refreshCompetitors, setRefreshCompetitors] = useState(false);
    const [refreshScores, setRefreshScores] = useState(false);

    const [selectedYear, setSelectedYear] = useState();
    const [selectedCompetitor, setSelectedCompetitor] = useState();

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

    /* once years retrieved and set, retrieve competitors */
    useEffect(() => {
        const getCompetitors = async () => {
            try {
                setIsCompetitorsLoading(true);
                const competitors = await sendRequest(API.getCompetitors() + selectedYear);
                if (competitors[0].noCompetitor) {
                    setIsCompetitorsEmpty(true);
                } else {
                    setSelectedCompetitor(competitors[0]);
                    setIsCompetitorsEmpty(false);
                }
                setLoadedCompetitors(competitors);
                setIsCompetitorsLoading(false);
                setRefreshCompetitors(false);
            } catch (er) {
                console.log(er.message);
            }
        }
        if (selectedYear) {
            getCompetitors();
        }
    }, [sendRequest, refreshCompetitors, selectedYear]);

    /* once years and competitors retrieved and set, retrieve scores */
    useEffect(() => {
        const getScores = async () => {
            try {
                setIsScoresLoading(true);
                const scores = await sendRequest(API.getScoresByCompetitor() + selectedCompetitor._id);
                setLoadedScores(scores);
                setRefreshScores(false);
                setIsScoresLoading(false);
            } catch (er) {
                console.log(er.message);
            }
        }
        if (selectedYear && selectedCompetitor) {
            getScores();
        }
    }, [sendRequest, refreshScores, selectedCompetitor]);

    useEffect(() => {
        setIsLoading(isYearsLoading || isCompetitorsLoading || isScoresLoading);
    }, [isYearsLoading, isCompetitorsLoading, isScoresLoading]);

    const yearSelectHandler = e => setSelectedYear(e.target.value);
    const competitorSelectHandler = e => {
        loadedCompetitors.forEach(c => {
            if (c._id === e.target.value) {
                setSelectedCompetitor(c);
            }
        });
    }
    const updateScoreHandler = data => {
        sendRequest(API.use("score"), "PUT", data).then(r => {
            if (r.message && r.message === "success") {
                setRefreshScores(true);
                msg("Success! Score has been updated.");
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
                <Subtitle text={"Select Competition Year"}/>
                <Line type={"large"}/>
                <select className={"full ctr-x"} onChange={yearSelectHandler}>
                    {isYearsLoading && (
                        <option value={"0"}>Loading... Please wait</option>
                    )}
                    {!isYearsLoading && (
                        loadedYears.map(year => {
                            return <option key={year._id} value={year._id}>{year.name}</option>
                        })
                    )}
                </select>
                <Subtitle text={"Select a Competitor"}/>
                <Line type={"large"}/>
                <select className={"full ctr-x"} onChange={competitorSelectHandler}>
                    {isCompetitorsLoading && (
                        <option value={"0"}>Loading... Please wait</option>
                    )}
                    {!isCompetitorsLoading && isCompetitorsEmpty && (
                        <option value={"0"}>Add a competitor on the competitor page</option>
                    )}
                    {!isCompetitorsLoading && !isCompetitorsEmpty && (
                        loadedCompetitors.map(competitor => {
                            if (competitor.firstName) {
                                return <option key={competitor._id} value={competitor._id}>{competitor.competitorNumber + " - " + competitor.firstName + " " + competitor.lastName}</option>
                            } else {
                                return <option key={competitor._id} value={competitor._id}>{competitor.competitorNumber + " - " + competitor.teamName + " - " + competitor.groupNames}</option>
                            }
                        })
                    )}
                </select>
            </Section>
            {!isScoresLoading && !isCompetitorsEmpty && (
                <Section className={"none"}>
                    {loadedScores.map(score => {
                        return <ScoreContainer key={score._id} id={score._id} eventName={score.eventName} score={score.score}
                                               minutes={score.timeMinutes} seconds={score.timeSeconds}
                                               updateScoreHandler={updateScoreHandler}/>
                    })}
                </Section>
            )}
            <LoadingAnimation state={isLoading}/>
            <Message text={message} state={messageState} closeModal={closeModal}/>
        </Main>
    );
}
export default Score;