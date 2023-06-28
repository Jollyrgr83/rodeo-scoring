import {useState} from "react";
import "../../shared/util.css";
import Subtitle from "../../shared/Subtitle";
import Line from "../../shared/Line";
import RoundButton from "../../shared/RoundButton";
const ScoreContainer = props => {
    const initScore = props.score === undefined ? "" : props.score;
    const initMinutes = props.minutes === undefined ? "" : props.minutes;
    const initSeconds = props.seconds === undefined ? "" : props.seconds;

    const [score, setScore] = useState(initScore);
    const [minutes, setMinutes] = useState(initMinutes);
    const [seconds, setSeconds] = useState(initSeconds);
    const scoreHandler = e => {
        let v = parseInt(e.target.value);
        setScore(e.target.value);
    }
    const minutesHandler = e => {
        setMinutes(e.target.value);
    }
    const secondsHandler = e => setSeconds(e.target.value);
    const btnHandler = () => {
        const data = {
            id: props.id,
            score: score,
            timeMinutes: minutes,
            timeSeconds: seconds
        };
        props.updateScoreHandler(data);
    }
    return (
        <div className={"container ctr-x ctr-text"}>
            <Subtitle text={props.eventName}/>
            <Line type={"large"}/>
            <div className={"row-container ctr-x"}>
                <p className={"text small ctr-x"}>Score</p>
                <p className={"text small ctr-x"}>Minutes</p>
                <p className={"text small ctr-x"}>Seconds</p>
            </div>
            <div className={"row-container ctr-x"}>
                <input className={"small ctr-x ctr-text"} type={"number"} onChange={scoreHandler} value={score}/>
                <input className={"small ctr-x ctr-text"} type={"number"} onChange={minutesHandler} value={minutes}/>
                <input className={"small ctr-x ctr-text"} type={"number"} onChange={secondsHandler} value={seconds}/>
            </div>
            <RoundButton color={"blue"} text={"Update"} onClick={btnHandler}/>
        </div>
    );
}
export default ScoreContainer;