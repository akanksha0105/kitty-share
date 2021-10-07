import React from "react";

function ShowModal() {
	return (
		<div>
			<Modal show={show} onHide={handleClose} animation={true}>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={handleClose}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default ShowModal;

// The DEVICE ALREADY EXISTS IN CONNECTIONS
// 			<div>Message Sent</div>
