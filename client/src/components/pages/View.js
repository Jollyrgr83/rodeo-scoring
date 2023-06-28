import {useEffect, useState} from "react";

import "../shared/util.css";

import Api from "../classes/api";

import { useHttp } from "../hooks/http";

import Main from "../shared/Main";
import Section from "../shared/Section";
import Subtitle from "../shared/Subtitle";
import Line from "../shared/Line";
import ViewAddContainer from "./view components/ViewAddContainer";
import ViewEditContainer from "./view components/ViewEditContainer";
import LoadingAnimation from "../shared/LoadingAnimation";
import Message from "../shared/Message";

const View = () => {
    const API = new Api();
    const categories = ["event", "organization", "tier", "year"];
    const {sendRequest} = useHttp();

    const [loadedData, setLoadedData] = useState();
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);

    const [url, setUrl] = useState(API.use(selectedCategory));
    const [message, setMessage] = useState("");
    const [messageState, setMessageState] = useState(false);

    /* retrieve and set values for selected category */
    useEffect(() => {
        const getData = async () => {
            try {
                setIsDataLoading(true);
                const data = await sendRequest(API.get(selectedCategory));
                setLoadedData(data);
                setRefreshData(false);
                setIsDataLoading(false);
            } catch (er) {
                console.log(er.message);
            }
        }
        getData();
    }, [sendRequest, refreshData, selectedCategory]);

    const editSelectHandler = e => {
        setSelectedCategory(e.target.value);
        setUrl(API.use(e.target.value));
    }
    const updateItemHandler = data => {
        if (data.action === "update") {
            sendRequest(url, "PUT", data).then(r => {
                if (r.message && r.message === "success") {
                    msg("Success! Item has been updated.");
                } else {
                    msg("Something has gone wrong. Please try again.");
                }
            });
        } else if (data.action === "delete") {
            sendRequest(url, "DELETE", data).then(r => {
                setRefreshData(true);
                if (r.message && r.message === "success") {
                    msg("Success! Item has been deleted.");
                } else {
                    msg("Something has gone wrong. Please try again.");
                }
            });
        }
    }
    const newItemHandler = data => {
        let dataCheck = false;
        if (data.type === "year") {
            const r = "0123456789";
            const str = data.value.toString();
            let toggle = true;
            for (let i = 0; i < str.length; i++) {
                if (!r.includes(str[i])) {
                    toggle = false;
                    i = str.length;
                }
            }
            dataCheck = toggle;
        } else {
            dataCheck = true;
        }
        if (data.value && data.value !== "" && dataCheck) {
            sendRequest(url, "POST", data).then(r => {
                setRefreshData(true);
                if (r.message && r.message === "success") {
                    msg("Success! Item has been updated.");
                } else {
                    msg("Something has gone wrong. Please try again.");
                }
            });
        } else {
            msg("Please ensure that your new item is not blank.");
        }
    }

    const msg = txt => {
        setMessage(txt);
        setMessageState(true);
    }
    const closeModal = () => setMessageState(false);
    const cap = txt => txt.charAt(0).toUpperCase() + txt.slice(1);

    return (
        <Main>
            <Section>
                <Subtitle text={"Select a Category"} />
                <Line type={"full"} />
                <select className="full ctr-x" onChange={editSelectHandler}>
                    {categories.map(category => {
                        return <option key={"edit-" + category} value={category}>{cap(category)}</option>
                    })}
                </select>
                <ViewEditContainer type={selectedCategory} items={loadedData} updateItemHandler={updateItemHandler} />
            </Section>
            <Section>
                <Subtitle text={"Add a New " + cap(selectedCategory)} />
                <Line type={"full"} />
                <ViewAddContainer addSectionState={selectedCategory} newItemHandler={newItemHandler}/>
            </Section>
            <LoadingAnimation state={isDataLoading}/>
            <Message text={message} state={messageState} closeModal={closeModal}/>
        </Main>
    );
}
export default View;