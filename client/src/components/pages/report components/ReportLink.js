const ReportLink = (props) => {
    const clickHandler = e => {
        props.downloadFile();
    }

    return (
        <a className={"button blue ctr-x"} target={"_self"} href={props.href} rel={"noreferrer"} download={"report.csv"} onClick={clickHandler}>Create csv</a>
    );
}
export default ReportLink;
