import "./util.css";

const Section = props => {
    const cls = props.className ? props.className : "container ctr-x ctr-text";
    return (
        <section id={props.id} className={cls}>{props.children}</section>
    );
}
export default Section;