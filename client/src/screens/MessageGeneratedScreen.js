import React from "react";

const MessageGeneratedScreen = (props) => {
	const { retrievedMessage } = props;
	return (
		<div>
			<div className="message__generated__form">
				<form>
					<label>
						{retrievedMessage}
						<div className="label-text">Generated Message</div>
					</label>
					<br />
				</form>
				<Modal show={show} onHide={handleClose}>
					<Modal.Body>{addDeviceMessage}</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							No
						</Button>
						{/* <Button variant="primary" onClick={handleClose}> */}
						<Button variant="primary" onClick={addDevice}>
							Yes
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</div>
	);
};

export default MessageGeneratedScreen;
