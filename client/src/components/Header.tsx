import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface HeaderProps {
	currentDeviceId: string,
	currentDeviceName: string,
	isDeviceSubscribed: boolean,
	onNotificationsPermission: () => void,
	isSubscribeButtonDisabled: boolean,
}

const Header: React.FC<HeaderProps> = ({
	currentDeviceId,
	currentDeviceName,
	isDeviceSubscribed,
	onNotificationsPermission,
	isSubscribeButtonDisabled,
}) => {
	const [linkClicked, setLinkClicked] = useState<boolean>(false);
	const [linkTwoClicked, setLinkTwoClicked] = useState<boolean>(false);

	const onLogoClick = () => {
		setLinkClicked(false);
		setLinkTwoClicked(false);

		if (window.location.href === "https://kittyshare.xyz/") {
			window.location.reload();
		}

	};

	const onLinkOneClick = () => {
		setLinkClicked(true);
		setLinkTwoClicked(false);
	};

	const onLinkTwoClick = () => {
		setLinkTwoClicked(true);
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
					<div onClick={onLinkOneClick} className="header__left__option">
						Add Device
					</div>
				</Link>

				<Link
					className={
						linkTwoClicked
							? "header__link__left__clicked"
							: "header__link__left"
					}
					to="/demo">
					<div onClick={onLinkTwoClick} className="header__left__option">
						How It Works
					</div>
				</Link>
			</div>

			<Link className="header__link" to="/">
				<div onClick={onLogoClick} className="logo">
					kittyshare
				</div>
			</Link>

			<div className="header__right">
				<Link className="header__link__left" to="/linktoanewdevice">
					<div className="header__right__icon">
						<AddCircleIcon />
					</div>
				</Link>
				<Link className="header__link__left" to="/demo">
					<div className="header__right__icon">
						<HelpOutlineIcon />
					</div>
				</Link>

				{currentDeviceName ? <div> {currentDeviceName}</div> : null}

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
};

export default Header;
