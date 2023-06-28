import {useState} from "react";
import Subtitle from "../../shared/Subtitle";
import Input from "../../shared/Input";
import RoundButton from "../../shared/RoundButton";

const CompetitorView = props => {
    const initName1 = props.competitor.firstName ? props.competitor.firstName : props.competitor.teamName;
    const initName2 = props.competitor.firstName ? props.competitor.lastName : props.competitor.groupNames;

    const [competitorNumber, setCompetitorNumber] = useState(props.competitor.competitorNumber);
    const [name1, setName1] = useState(initName1);
    const [name2, setName2] = useState(initName2);

    const competitorNumberHandler = e => setCompetitorNumber(e.target.value);
    const name1Handler = e => setName1(e.target.value);
    const name2Handler = e => setName2(e.target.value);
    const updateBtnHandler = () => {
        const c = {
            action: "update",
            id: props.competitor._id,
            competitorNumber: competitorNumber
        };
        if (props.competitor.firstName) {
            c.firstName = name1;
            c.lastName = name2;
        } else {
            c.teamName = name1;
            c.groupNames = name2;
        }
        props.updateCompetitorHandler(c);
    }
    const deleteBtnHandler = () => {
        props.updateCompetitorHandler({action: "delete", id: props.competitor._id});
    }
    const name1Text = props.competitor.firstName ? "First Name" : "Team Name";
    const name2Text = props.competitor.firstName ? "Last Name" : "Group Names";

    return (
        <div id={"view-dynamic-comp-info"}>
            <Subtitle text={"Competitor Number"}/>
            <Input className={"full"} value={competitorNumber} onChange={competitorNumberHandler}/>
            <Subtitle text={name1Text}/>
            <Input className={"full"} value={name1} onChange={name1Handler}/>
            <Subtitle text={name2Text}/>
            <Input className={"full"} value={name2} onChange={name2Handler}/>
            <Subtitle text={"Organization"}/>
            <Input className={"full"} value={props.competitor.organizationName} readOnly={true}/>
            <div className={"ctr-x ctr-text row-container"}>
                <RoundButton id={"comp-save-button"} color={"blue"} text={"Update"} onClick={updateBtnHandler}/>
                <RoundButton id={"comp-delete-button"} color={"red"} text={"Delete"} onClick={deleteBtnHandler}/>
            </div>
        </div>
    );
}
export default CompetitorView;