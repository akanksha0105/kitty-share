import React from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";

function Header() {
	return (
		<div className="header">
			<div className="header__left">
				<Link className="header__link__left" to="linktoanewdevice">
					<div className="header__left__option"> Add Device</div>
				</Link>
			</div>

			<Link className="header__link" to="/">
				<div className="logo">kittyshare</div>
			</Link>

			<div className="header__right">
				<div>
					<Avatar
						alt="Remy Sharp"
						src={`https://avatars.dicebear.com/api/human/123.svg`}
					/>{" "}
				</div>{" "}
				<div> Device Name </div>
			</div>
		</div>
	);
}

export default Header;
