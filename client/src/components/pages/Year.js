import {useEffect, useState} from "react";

import "../shared/util.css";

import Api from "../classes/api";

import { useHttp } from "../hooks/http";

import Main from "../shared/Main";
import Section from "../shared/Section";
import Subtitle from "../shared/Subtitle";
import Line from "../shared/Line";
import SquareButton from "../shared/SquareButton";
import YearTier from "./year components/YearTier";
import LoadingAnimation from "../shared/LoadingAnimation";
import Message from "../shared/Message";

const Year = () => {
    const API = new Api();
    const {sendRequest} = useHttp();

    const [loadedYears, setLoadedYears] = useState();
    const [loadedCompetitionTiers, setLoadedCompetitionTiers] = useState();
    const [loadedOpenTiers, setLoadedOpenTiers] = useState();

    const [selectedYear, setSelectedYear] = useState();
    const [selectedOpenTier, setSelectedOpenTier] = useState();
    const [isCompetitionTiersEmpty, setIsCompetitionTiersEmpty] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isYearsLoading, setIsYearsLoading] = useState(true);
    const [isCompetitionTiersLoading, setIsCompetitionTiersLoading] = useState(true);
    const [isOpenTiersLoading, setIsOpenTiersLoading] = useState(true);

    const [refreshYears, setRefreshYears] = useState(false);
    const [refreshCompetitionTiers, setRefreshCompetitionTiers] = useState(false);
    const [refreshOpenTiers, setRefreshOpenTiers] = useState(false);

    const [message, setMessage] = useState("");
    const [messageState, setMessageState] = useState(false);

    /* retrieve and set years */
    useEffect(() => {
        const getYearData = async () => {
            try {
                setIsYearsLoading(true);
                const years = await sendRequest(API.get("year"));
                setLoadedYears(years);
                setSelectedYear(years[0]._id);
                setRefreshYears(false);
                setIsYearsLoading(false);
            } catch (er) {
                console.log(er.message);
            }
        }
        getYearData();
    },[refreshYears]);

    /* once years retrieved and set, retrieve full competition tiers */
    useEffect(() => {
        const getCompetitionTiers = async () => {
            try {
                setIsCompetitionTiersLoading(true);
                const competitionTiers = await sendRequest(API.getCompetitionTiers() + selectedYear);
                if (competitionTiers[0].empty) {
                    setIsCompetitionTiersEmpty(true);
                } else {
                    setIsCompetitionTiersEmpty(false);
                }
                setLoadedCompetitionTiers(competitionTiers);
                setRefreshCompetitionTiers(false);
                setIsCompetitionTiersLoading(false);
            } catch (er) {
                console.log(er.message);
            }
        }
        if (selectedYear) {
            getCompetitionTiers();
        }
    }, [selectedYear, refreshCompetitionTiers]);

    /* once years retrieved and set, retrieve open tiers */
    useEffect(() => {
        const getOpenTiers = async () => {
            try {
                setIsOpenTiersLoading(true);
                const openTiers = await sendRequest(API.getOpenCompetitionTiers() + selectedYear);
                if (openTiers.data.length > 0) {
                    setLoadedOpenTiers(openTiers.data);
                    setSelectedOpenTier(openTiers.data[0]._id);
                } else {
                    setLoadedOpenTiers([{_id: "noAddTiers", name: "Add more tiers on view page" }]);
                    setSelectedOpenTier("noAddTiers");
                }
                setRefreshOpenTiers(false);
                setIsOpenTiersLoading(false);
            } catch (er) {
                console.log(er.message);
            }
        }
        if (selectedYear) {
            getOpenTiers();
        }
    }, [selectedYear, refreshOpenTiers]);

    useEffect(() => {
        setIsLoading(isYearsLoading || isCompetitionTiersLoading || isOpenTiersLoading);
    }, [isYearsLoading, isCompetitionTiersLoading, isOpenTiersLoading]);

    const yearSelectHandler = e => setSelectedYear(e.target.value);
    const openTiersSelectHandler = e => setSelectedOpenTier(e.target.value);
    const addTierEventHandler = data => {
        if (data.event_id === "0") {
            msg("No additional events. Please add another event on the view page.");
        } else {
            data.year_id = selectedYear;
            sendRequest(API.use("competitionEvent"), "POST", data).then(r => {
                if (r.message && r.message === "success") {
                    setRefreshCompetitionTiers(true);
                    msg("Success! Event has been added.");
                } else {
                    msg("Something went wrong. Please try again.");
                }
            });
        }
    }
    const deleteTierEventHandler = data => {
        sendRequest(API.use("competitionEvent"), "DELETE", data).then(r => {
            if (r.message && r.message === "success") {
                setRefreshCompetitionTiers(true);
                setRefreshOpenTiers(true);
                msg("Success! Event has been removed.");
            } else {
                msg("Something has gone wrong. Please try again.");
            }
        });
    }
    const addTierBtnHandler = () => {
        if (selectedOpenTier === "noAddTiers") {
            msg("There are no additional competition tiers to add. Please add competition tiers on the view page.");
        } else {
            sendRequest(API.use("competitionTier"), "POST", {year_id: selectedYear, tier_id: selectedOpenTier}).then(r => {
                if (r.message && r.message === "success") {
                    setRefreshCompetitionTiers(true);
                    setRefreshOpenTiers(true);
                    msg("Success! Competition Tier has been added.");
                } else {
                    msg("Something has gone wrong. Please try again.");
                }
            });
        }
    }
    const deleteTierHandler = data => {
        sendRequest(API.use("competitionTier"), "DELETE", data).then(r => {
            if (r.message && r.message === "success") {
                setRefreshCompetitionTiers(true);
                setRefreshOpenTiers(true);
                msg("Success! Competition Tier has been removed.");
            } else {
                msg("Something has gone wrong. Please try again.");
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
                <Subtitle text={"Select Competition Year"} />
                <Line type={"full"} />
                <select className="full ctr-x" onChange={yearSelectHandler}>
                    {!isYearsLoading && loadedYears.map(year => {
                        return <option key={year._id} value={year._id}>{year.name}</option>
                    })}
                </select>
            </Section>
            {!isCompetitionTiersLoading && isCompetitionTiersEmpty && (
                <Section>
                    <Subtitle text={"No Competition Tiers. Add a Competition Tier."}/>
                </Section>
            )}
            {!isCompetitionTiersLoading && !isCompetitionTiersEmpty && (
                <div id="dynamic">
                    {loadedCompetitionTiers.map(tier => {
                        return <YearTier key={tier._id} id={tier._id} name={tier.name} addEv={[...tier.addEvents]} ev={[...tier.events]} addTierEventHandler={addTierEventHandler} deleteTierHandler={deleteTierHandler} deleteTierEventHandler={deleteTierEventHandler} />
                    })}
                </div>
            )}
            {!isOpenTiersLoading && (
                <Section>
                    <Subtitle text={"Add a Competition Tier"} />
                    <Line type={"large"} />
                    <div className="ctr-x ctr-text row-container">
                        <select className="large ctr-x" onChange={openTiersSelectHandler}>
                            {loadedOpenTiers.map(tier => {
                                return <option key={tier._id} id={tier._id} value={tier._id}>{tier.name}</option>
                            })}
                        </select>
                        <SquareButton type={"add"} onClick={addTierBtnHandler}/>
                    </div>
                </Section>
            )}
            <LoadingAnimation state={isLoading}/>
            <Message text={message} state={messageState} closeModal={closeModal}/>
        </Main>
    );
}
export default Year;