import "./util.css";
const Main = props => {
    const className = "ctr-x " + props.className;
    return (
        <main className={className}>{props.children}</main>
    );
}
export default Main;