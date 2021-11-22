import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import * as serviceWorkerRegistration from "../serviceWorkerRegistration";
import axios from "axios";

function Header(props) {
	const { currentDeviceId, currentDeviceName } = props;
	const [linkClicked, setLinkClicked] = useState(false);
	const [logoClick, setLogoClick] = useState(false);
	const [isSubscribedToNotifications, setIsSubscribedToNotifications] =
		useState("false");

	const [openUnsubscriptionModal, setOpenUnSubscriptionModal] = useState(false);

	const hideUnsubscriptionModal = () => {
		setOpenUnSubscriptionModal(false);
	};

	const checkDeviceSubscribedToNotifications = () => {
		let isSubscribed = JSON.parse(localStorage.getItem("isSubscribed"));
		console.log(
			"isSubscribed in checkDeviceSubscribedToNotifications",
			isSubscribed,
		);

		if (isSubscribed === null) {
			console.log("Loop 1");
			localStorage.setItem("isSubscribed", false);
			setIsSubscribedToNotifications(false);
			return;
		}

		if (isSubscribed === true) {
			console.log("Loop 2");
			localStorage.setItem("isSubscribed", true);
			setIsSubscribedToNotifications(true);
			return;
		}

		if (isSubscribed === false) {
			console.log("Loop 3");
			localStorage.setItem("isSubscribed", false);
			setIsSubscribedToNotifications(false);
			return;
		}
	};

	const onNotificationsPermission = () => {
		let isSubscribed = isSubscribedToNotifications;
		console.log("isSubscribed in onNotificationsPermission", isSubscribed);
		if (isSubscribed === false) {
			console.log(
				"isSubscribed in  Loop1 onNotificationsPermission",
				isSubscribed,
			);

			serviceWorkerRegistration
				.subscribeToPushNotifications()
				.then((response) => {
					console.log("subscribed to push notifications", response);

					if (response === true) {
						console.log("Here");
						localStorage.setItem("isSubscribed", true);
						setIsSubscribedToNotifications(true);
					} else {
						console.log("Here2");
					}
				})
				.catch((err) => {
					console.error(
						"Application not registered for the push notifications",
						err,
					);
					localStorage.setItem("isSubscribed", false);
					setIsSubscribedToNotifications(false);
				});
			return;
		}

		if (isSubscribed === true) {
			console.log(
				"isSubscribed in  Loop2 onNotificationsPermission",
				isSubscribed,
			);

			setOpenUnSubscriptionModal(true);

			return;
		}
	};

	const unsubscribePushNotifications = () => {
		serviceWorkerRegistration
			.unsubscribeTopushNotifications()
			.then((response) => {
				console.log("unsubscribed push notifications", response);
				if (response === true) {
					//delete the subscription object from the database
					deleteSubscriptionFromDatabase();
					hideUnsubscriptionModal();
				}
			})
			.catch((err) => {
				console.error(
					"Application unable to unsubscribe push notifications",
					err,
				);
			});
	};

	const onLogoClick = (event) => {
		setLinkClicked(false);
	};

	const deleteSubscriptionFromDatabase = () => {
		let subscriptionId = currentDeviceId;
		const deletedSubscriptionPromise = axios.delete(
			`http://localhost:8080/api/subscription/subscribeddevice/${subscriptionId}`,
		);

		deletedSubscriptionPromise
			.then((deletedSubscriptionPromiseResponse) => {
				console.log(
					"deletedSubscriptionPromiseResponse",
					deletedSubscriptionPromiseResponse.data.message,
				);

				if (
					deletedSubscriptionPromiseResponse.data.isSubscriptionDeleted === true
				) {
					localStorage.setItem("isSubscribed", false);
					setIsSubscribedToNotifications(false);
				}
			})
			.catch((err) => {
				console.error("Unable to unsubscribe", err);
			});
	};

	useEffect(() => {
		let ans = checkDeviceSubscribedToNotifications();
		console.log(ans);
	});
	return (
		<div className="header">
			<div className="header__left">
				<Link
					className={
						linkClicked ? "header__link__left clicked" : "header__link__left"
					}
					to={!linkClicked ? "/linktoanewdevice" : "/"}>
					<div
						onClick={(e) => setLinkClicked(!linkClicked)}
						className="header__left__option">
						Add Device
					</div>
				</Link>
			</div>

			<Link className="header__link" to="/">
				<div onClick={onLogoClick} className="logo">
					kittyshare
				</div>
			</Link>

			<div className="header__right">
				{/* Used custom seed as currentDeviceId for generating Avatar */}
				{currentDeviceId ? (
					<div>
						<Avatar
							alt="Remy Sharp"
							src={`https://avatars.dicebear.com/api/human/${currentDeviceId}.svg`}
						/>{" "}
					</div>
				) : null}

				{currentDeviceName ? <div> {currentDeviceName}</div> : null}

				{currentDeviceId &&
				localStorage.getItem("notificationsServicePossible") ? (
					<div className="subscription__button">
						<button
							onClick={onNotificationsPermission}
							className="subscribe__button">
							{" "}
							{isSubscribedToNotifications == true ? "Subscribed" : "Subscribe"}
							{/* {subscribeOptionButtonText} */}
						</button>
					</div>
				) : null}
			</div>

			<div
				className={
					openUnsubscriptionModal ? "modal display-block" : "modal display-none"
				}>
				<div className="modal__message">
					"Do you want to unsubscribe from kittyshare"
				</div>
				<div className="modal__options">
					<button
						type="button"
						className="button__1"
						onClick={hideUnsubscriptionModal}>
						Cancel
					</button>
					<button
						type="button"
						className="button__1"
						onClick={unsubscribePushNotifications}>
						Unsubscribe
					</button>
				</div>
			</div>
		</div>
	);
}

export default Header;
