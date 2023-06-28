import "../../shared/util.css";
import Subtitle from "../../shared/Subtitle";
import Line from "../../shared/Line";
const ReportResultContainer = props => {
    return (
        <div className="result-container ctr-x">
            <Subtitle text={"Place: " + props.place}/>
            <Line type={"large"}/>
            <p className="text ctr-x">{"Competitor Number: " + props.competitorNumber}</p>
            <p className="text ctr-x">{props.firstName + " " + props.lastName}</p>
            <p className="text ctr-x">{props.organization}</p>
            <p className="text ctr-x">{"Score: " + props.score}</p>
            <p className="text ctr-x">{"Time (m:ss): " + props.time}</p>
        </div>
    );
}
export default ReportResultContainer;