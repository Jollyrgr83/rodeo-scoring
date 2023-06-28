import {useState} from "react";
import "../../shared/util.css";
import Section from "../../shared/Section";
import Subtitle from "../../shared/Subtitle";
import Line from "../../shared/Line";
import SquareButton from "../../shared/SquareButton";
import RoundButton from "../../shared/RoundButton";
import YearItemRow from "./YearItemRow";
const YearTier = props => {
    const isEvents = props.ev.length > 0;
    const isAddEvents = props.addEv.length > 0
    const initEventSelectId = isAddEvents ? props.addEv[0]._id : "0";
    const initEventSelectValue = isAddEvents > 0 ? props.addEv[0].name : "Add more events on view page";

    const [addEventSelectValue, setAddEventSelectValue] = useState(initEventSelectId);
    const deleteItemHandler = data => {
        // ref = {id: ""};
        data.tierId = props.id;
        props.deleteTierEventHandler(data);
    }
    const addEventSelectHandler = e => setAddEventSelectValue(e.target.value);
    const addEventBtnHandler = () => {
        if (addEventSelectValue !== "noAddEvents") {
            props.addTierEventHandler({competition_tier_id: props.id, event_id: addEventSelectValue });
        }
    }
    const deleteBtnHandler = () => {
        props.deleteTierHandler({id: props.id});
    }
    return (
        <Section>
            <Subtitle text={props.name + " Tier"} />
            <Line type={"large"} />
            {props.ev.length > 0 && props.ev.map(ev => {
                return <YearItemRow id={ev._id} key={ev._id} itemId={ev._id} value={ev.name} deleteItemHandler={deleteItemHandler} />
            })}

            <Subtitle text={"Add New Event"} />

            <div className={"ctr-x ctr-text row-container"}>
                <select className={"large ctr-x"} onChange={addEventSelectHandler}>
                    {props.addEv.length === 0 && (
                        <option value="noAddEvents">Add more events on the view page</option>
                    )}
                    {props.addEv.length > 0 && (props.addEv.map(ev => {
                        return <option key={ev._id} value={ev._id}>{ev.name}</option>
                    }))}
                </select>
                <SquareButton type={"add"} onClick={addEventBtnHandler}/>
            </div>

            <Subtitle text={"Delete This Tier?"} />

            <RoundButton color={"red"} text={"Delete"} onClick={deleteBtnHandler}/>
        </Section>
    );
}
export default YearTier;