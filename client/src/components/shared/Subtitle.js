import "./util.css";
const Subtitle = props => {
    const cls = props.size ? props.size + " subtitle ctr-x" : "subtitle ctr-x";
    return (
        <p className={cls}>{props.text}</p>
    );
}
export default Subtitle;