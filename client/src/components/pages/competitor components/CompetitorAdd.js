import {useState} from "react";
import "../../shared/util.css";
import Subtitle from "../../shared/Subtitle";
import Input from "../../shared/Input";
import RoundButton from "../../shared/RoundButton";

const CompetitorAdd = props => {
    const [addCompetitorNumber, setAddCompetitorNumber] = useState("");
    const [addCompetitorFirstName, setAddCompetitorFirstName] = useState("");
    const [addCompetitorLastName, setAddCompetitorLastName] = useState("");
    const [addCompetitorTeamName, setAddCompetitorTeamName] = useState("");
    const [addCompetitorGroupNames, setAddCompetitorGroupNames] = useState("");
    const [addCompetitorOrg, setAddCompetitorOrg] = useState(props.organizations[0]._id);
    const addCompetitorOrgSelectHandler = e => setAddCompetitorOrg(e.target.value);
    const addCompetitorNumberHandler = e => setAddCompetitorNumber(e.target.value);
    const addCompetitorFirstNameHandler = e => setAddCompetitorFirstName(e.target.value);
    const addCompetitorLastNameHandler = e => setAddCompetitorLastName(e.target.value);
    const addCompetitorTeamNameHandler = e => setAddCompetitorTeamName(e.target.value);
    const addCompetitorGroupNamesHandler = e => setAddCompetitorGroupNames(e.target.value);
    const resetFields = () => {
        setAddCompetitorNumber("");
        setAddCompetitorFirstName("");
        setAddCompetitorLastName("");
        setAddCompetitorTeamName("");
        setAddCompetitorGroupNames("");
        setAddCompetitorOrg(props.organizations[0]._id);
    }
    const addCompetitorBtnHandler = () => {
        if (addCompetitorNumber === "") {
            props.msgHandler("Competitor Number cannot be blank.");
        } else {
            if (props.tierType === false) {
                if (addCompetitorFirstName === "" || addCompetitorLastName === "") {
                    props.msgHandler("Competitor Names cannot be blank.");
                } else {
                    props.addCompetitorHandler({
                        competitorNumber: addCompetitorNumber,
                        firstName: addCompetitorFirstName,
                        lastName: addCompetitorLastName,
                        organizationID: addCompetitorOrg
                    });
                    resetFields();
                }
            } else {
                if (addCompetitorTeamName === "" || addCompetitorGroupNames === "") {
                    this.props.msgHandler("Competitor Names cannot be blank.");
                } else {
                    props.addCompetitorHandler({
                        competitorNumber: addCompetitorNumber,
                        teamName: addCompetitorTeamName,
                        groupNames: addCompetitorGroupNames,
                        organizationID: addCompetitorOrg
                    });
                    resetFields();
                }
            }
        }
    }

    if (props.tierType === false) {
        return (
            <div id="add-dynamic-comp-info">
                <Subtitle text={"Competitor Number"}/>
                <Input className={"full"} type={"text"} value={addCompetitorNumber} onChange={addCompetitorNumberHandler}/>
                <Subtitle text={"First Name"}/>
                <Input className={"full"} type={"text"} value={addCompetitorFirstName} onChange={addCompetitorFirstNameHandler}/>
                <Subtitle text={"Last Name"}/>
                <Input className={"full"} type={"text"} value={addCompetitorLastName} onChange={addCompetitorLastNameHandler}/>
                <Subtitle text={"Organization"}/>

                <select className="full ctr-x" onChange={addCompetitorOrgSelectHandler}>
                    {props.organizations.map(o => {
                        return <option key={o._id} id={o._id} value={o._id}>{o.name}</option>
                    })}
                </select>

                <RoundButton color={"blue"} text={"Add"} onClick={addCompetitorBtnHandler}/>
            </div>
        );
    } else {
        return (
            <div id="add-dynamic-comp-info">
                <Subtitle text={"Competitor Number"}/>
                <Input className={"full"} type={"text"} value={addCompetitorNumber} onChange={addCompetitorNumberHandler}/>
                <Subtitle text={"Team Name"}/>
                <Input className={"full"} type={"text"} value={addCompetitorTeamName} onChange={addCompetitorTeamNameHandler}/>
                <Subtitle text={"Competitor Names"}/>
                <Input className={"full"} type={"text"} value={addCompetitorGroupNames} onChange={addCompetitorGroupNamesHandler}/>
                <Subtitle text={"Organization"}/>

                <select className="full ctr-x" onChange={addCompetitorOrgSelectHandler} value={addCompetitorOrg}>
                    {props.organizations.map(o => {
                        return <option key={o._id} id={o._id} value={o._id}>{o.name}</option>
                    })}
                </select>

                <RoundButton color={"blue"} text={"Add"} onClick={addCompetitorBtnHandler}/>
            </div>
        );
    }
}
export default CompetitorAdd;