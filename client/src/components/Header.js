import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";

import axios from "axios";

function Header(props) {
	const {
		currentDeviceId,
		currentDeviceName,
		isDeviceSubscribed,
		onNotificationsPermission,
		isSubscribeButtonDisabled,
	} = props;
	const [linkClicked, setLinkClicked] = useState(false);
	const [logoClick, setLogoClick] = useState(false);

	console.log("isDeviceSubscribed in Header: ", isDeviceSubscribed);

	const onLogoClick = (event) => {
		setLinkClicked(false);
	};

	return (
		<div className="header">
			<div className="header__left">
				<Link
					className={
						linkClicked ? "header__link__left__clicked" : "header__link__left"
					}
					to="/linktoanewdevice">
					<div
						onClick={(e) => setLinkClicked(true)}
						className="header__left__option">
						Add Device
					</div>
				</Link>

				<Link
					className={
						linkClicked ? "header__link__left__clicked" : "header__link__left"
					}
					to="/demo">
					<div
						onClick={(e) => setLinkClicked(true)}
						className="header__left__option">
						How It Works
					</div>
				</Link>

				{/* <div className="fa fa-bars"></div> */}
			</div>

			<Link className="header__link" to="/">
				<div onClick={onLogoClick} className="logo">
					kittyshare
				</div>
			</Link>

			<div className="header__right">
				{currentDeviceId ? (
					<div>
						<Avatar
							alt="Remy Sharp"
							src={`https://avatars.dicebear.com/api/human/${currentDeviceId}.svg`}
						/>{" "}
					</div>
				) : null}

				{currentDeviceName ? <div> {currentDeviceName}</div> : null}

				{/* {currentDeviceId &&
				localStorage.getItem("notificationsServicePossible") ? (
					<div
						className={
							localStorage.getItem("device saved") === true
								? "subscription__button"
								: null
						}> */}

				<div className="subscription__button">
					<button
						disabled={isSubscribeButtonDisabled}
						onClick={onNotificationsPermission}
						className={
							isDeviceSubscribed
								? "subscribe__button__active"
								: "subscribe__button__inactive"
						}>
						{" "}
						{isDeviceSubscribed ? "Subscribed" : "Subscribe"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default Header;
