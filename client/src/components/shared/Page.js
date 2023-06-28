import "./util.css";

import PageWrapper from "./PageWrapper";
import Header from "../header/Header";
import Home from "../pages/Home";
import View from "../pages/View";
import Year from "../pages/Year";
import Competitor from "../pages/Competitor";
import Score from "../pages/Score";
import Report from "../pages/Report";
const Page = ({type}) => {
    switch (type) {
        case "view":
            return (
                <PageWrapper>
                    <Header title={"View / Edit Database Options"} />
                    <View />
                </PageWrapper>
            );
        case "year":
            return (
                <PageWrapper>
                    <Header title={"Year Setup"} />
                    <Year />
                </PageWrapper>
            );
        case "competitor":
            return (
                <PageWrapper>
                    <Header title={"Add / Edit Competitors"} />
                    <Competitor />
                </PageWrapper>
            );
        case "score":
            return (
                <PageWrapper>
                    <Header title={"Score Entry"} />
                    <Score />
                </PageWrapper>
            );
        case "report":
            return (
                <PageWrapper>
                    <Header title={"View / Print Reports"} />
                    <Report />
                </PageWrapper>
            );
        case "home":
        default:
            return (
                <PageWrapper>
                    <Header title={"Annual Lineworkers Rodeo Scoring"} />
                    <Home />
                </PageWrapper>
            );
    }
}
export default Page;