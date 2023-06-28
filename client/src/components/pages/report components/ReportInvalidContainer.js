import "../../shared/util.css";
const ReportInvalidContainer = props => {
    let missingEvents = "";
    for (let i = 0; i < props.missingEvents.length; i++) {
        if (i === props.missingEvents.length - 1) {
            missingEvents += props.missingEvents[i];
        } else {
            missingEvents += props.missingEvents[i] + ",";
        }
    }
    return (
        <div className="result-container ctr-x">
            <p className="text ctr-x">{"Competitor Number: " + props.competitorNumber}</p>
            <p className="text ctr-x">Event(s): {missingEvents}</p>
        </div>
    );
}
export default ReportInvalidContainer;