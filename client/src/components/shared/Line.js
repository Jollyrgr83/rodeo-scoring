import "./util.css";
import "./Line.css";
const Line = ({type}) => {
    const className = "line " + type + " ctr-x";
    return (
        <hr className={className} />
    );
}
export default Line;