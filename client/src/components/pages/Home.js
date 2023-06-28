import {Link} from "react-router-dom";

import "../shared/util.css";
import "./home components/Home.css";

import Main from "../shared/Main";
import HomeNav from "../shared/HomeNav";
import NavButton from "../shared/NavButton";
import Line from "../shared/Line";
import Text from "../shared/Text";

const Home = (props) => {
    return (
        <Main className={"home-container container"}>
            <Link id={"home-view"} className={"no-link"} to={"/view/"} onClick={props.navHandler}>
                <HomeNav>
                    <NavButton type={"view"} className={"nav-icon ctr-x"} />
                    <p className={"home-nav-text"}>View / Edit</p>
                </HomeNav>
            </Link>
            <Text text={"Add or Update Tiers, Events, Competition Years, and Organizations"} />
            <Line type={"large"} />

            <Link id={"home-year"} className={"no-link"} to={"/year/"} onClick={props.navHandler}>
                <HomeNav>
                    <NavButton type={"year"} className={"nav-icon ctr-x"} />
                    <p className={"home-nav-text"}>Year Setup</p>
                </HomeNav>
            </Link>
            <Text text={"Add Active Tiers and Events for a Competition Year"} />
            <Line type={"large"} />

            <Link id={"home-competitor"} className={"no-link"} to={"/competitor/"} onClick={props.navHandler}>
                <HomeNav>
                    <NavButton type={"competitor"} className={"nav-icon ctr-x"} />
                    <p className={"home-nav-text"}>Competitors</p>
                </HomeNav>
            </Link>
            <Text text={"Add or Update Competitor Information"} />
            <Line type={"large"} />

            <Link id={"home-score"} className={"no-link"} to={"/score/"} onClick={props.navHandler}>
                <HomeNav>
                    <NavButton type={"score"} className={"nav-icon ctr-x"} />
                    <p className={"home-nav-text"}>Scores</p>
                </HomeNav>
            </Link>
            <Text text={"Input Event Scores for Competitors"} />
            <Line type={"large"} />

            <Link id={"home-report"} className={"no-link"} to={"/report/"} onClick={props.navHandler}>
                <HomeNav>
                    <NavButton type={"report"} className={"nav-icon ctr-x"} />
                    <p className={"home-nav-text"}>Reports</p>
                </HomeNav>
            </Link>
            <Text text={"View Results and Generate Reports"} />
            <Line type={"large"} />
        </Main>
    );
}
export default Home;