import "../../shared/util.css";
import Input from "../../shared/Input";
import Subtitle from "../../shared/Subtitle";
import Select from "../../shared/Select";
import RoundButton from "../../shared/RoundButton";
import {useState} from "react";

const ViewAddContainer = props => {
    const [tierText, setTierText] = useState("");
    const [eventText, setEventText] = useState("");
    const [organizationText, setOrganizationText] = useState("");
    const [yearText, setYearText] = useState("");

    const [tierSelect, setTierSelect] = useState("false");
    const [organizationSelect, setOrganizationSelect] = useState("true");

    const tierTextHandler = e => setTierText(e.target.value);
    const eventTextHandler = e => setEventText(e.target.value);
    const organizationTextHandler = e => setOrganizationText(e.target.value);
    const yearTextHandler = e => setYearText(e.target.value);

    const tierSelectHandler = e => setTierSelect(e.target.value);
    const organizationSelectHandler = e => setOrganizationSelect(e.target.value);

    const tierBtnHandler = e => {
        props.newItemHandler({type: "tier", value: tierText, select: tierSelect});
        setTierText("");
        setTierSelect("false");
    }
    const eventBtnHandler = e => {
        props.newItemHandler({type: "event", value: eventText});
        setEventText("");
    }
    const organizationBtnHandler = e => {
        props.newItemHandler({type: "organization", value: organizationText, select: organizationSelect});
        setOrganizationText("");
        setOrganizationSelect("true");
    }
    const yearBtnHandler = e => {
        props.newItemHandler({type: "year", value: yearText});
        setYearText("");
    }

    const cls = {"tier": "hide", "event": "hide", "organization": "hide", "year": "hide"};
    cls[props.addSectionState] = "show-block";
    return (
        <div id={"add-container"}>
            <div id="add-container-tiers" data-key="tiers" className={cls.tier}>
                <Subtitle size={"full"} text={"Enter Name"} />
                <Input id={"add-container-input-tiers"} className={"full"} type={"text"} onChange={tierTextHandler} value={tierText} />
                <Subtitle size={"full"} text={"Are the competitors in this tier individuals or teams?"} />
                <Select id={"tiers-add-select"} className={"full ctr-x"} onChange={tierSelectHandler}>
                    <option value="false">Individuals</option>
                    <option value="true">Teams</option>
                </Select>
                <RoundButton id={"add-container-button-tiers"} color={"blue"} text={"Add"} onClick={tierBtnHandler}/>
            </div>
            <div id="add-container-events" data-key="events" className={cls.event}>
                <Subtitle size={"full"} text={"Enter Name"} />
                <Input id={"add-container-input-event"} className={"full"} type={"text"} onChange={eventTextHandler} value={eventText} />
                <RoundButton id={"add-container-button-events"} color={"blue"} text={"Add"} onClick={eventBtnHandler} />
            </div>
            <div id="add-container-organizations" data-key="organizations" className={cls.organization}>
                <Subtitle size={"full"} text={"Enter Name"} />
                <Input id={"add-container-input-organization"} className={"full"} type={"text"} onChange={organizationTextHandler} value={organizationText} />
                <Subtitle size={"full"} text={"Is this organization a coop?"} />
                <Select id={"organizations-add-select"} className={"full ctr-x"} onChange={organizationSelectHandler}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </Select>
                <RoundButton id={"add-container-button-organizations"} color={"blue"} text={"Add"} onClick={organizationBtnHandler} />
            </div>
            <div id="add-container-years" data-key="years" className={cls.year}>
                <Subtitle size={"full"} text={"Enter Year"} />
                <Input id={"add-container-input"} className={"full"} type={"text"} onChange={yearTextHandler} value={yearText} />
                <RoundButton id={"add-container-button-year"} color={"blue"} text={"Add"} onClick={yearBtnHandler} />
            </div>
        </div>
    );
}
export default ViewAddContainer;