import "./util.css";
import "./RoundButton.css"
const RoundButton = props => {
    return (
        <button id={props.id} className={"button ctr-x " + props.color} onClick={props.onClick}>{props.text}</button>
    );
}
export default RoundButton;