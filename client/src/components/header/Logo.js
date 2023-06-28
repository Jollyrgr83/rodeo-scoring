import "../shared/util.css";
import "./Logo.css";


import logo from '../../logo.png';

const Logo = () => {
    return (
        <div className="grid-one grid-ctr-x grid-ctr-y">
            <img src={logo} className="logo ctr-x" alt="logo" />
        </div>
    );
}
export default Logo;