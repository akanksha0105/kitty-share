import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import axios from 'axios';
import KeyGeneratedScreen from './KeyGeneratedScreen';

function TextInputScreen({ currentDeviceId }) {
	const [isdisabled, setIsDisabled] = useState(false);
	const [searchInput, setSearchInput] = useState('');
	const [generatedCode, setGeneratedCode] = useState('');

	const generateSecretKey = async () => {
		let valueOfTheURL = searchInput;

		console.log('URL entered by the user', valueOfTheURL);
		let secretKeyPromise = axios.post(
			'http://localhost:8080/api/code/postthevalue',
			{
				valueOfTheURL,
			},
		);

		secretKeyPromise
			.then((response) => {
				setGeneratedCode(response.data.data);
				console.log('Generated Key provided by the server');
			})
			.catch((error) => {
				const { code } = error.response.data;
				if (code === 102) {
					return console.error('Code does not exist');
				}

				console.error('Unable to generate code');
			});
	};
	const onToggleMoveToTextButton = () => {
		setIsDisabled(!isdisabled);
		setSearchInput('');
		setGeneratedCode('');
	};

	const onMoveToInputKeyScreen = () => {
		setIsDisabled(!isdisabled);
	};

	const onFormSubmit = (event) => {
		event.preventDefault();
		generateSecretKey();
		setIsDisabled(!isdisabled);
	};

	return (
		<div className='text__input__screen'>
			{!isdisabled ? (
				<div className='text__input__form'>
					<form onSubmit={onFormSubmit}>
						<label>
							<input
								name='name'
								id='name'
								type='text'
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								required
							/>
							<div className='label-text'>Enter the text to be shared</div>
						</label>
						<br />

						<Link
							to={{
								pathname: '/linktoanewdevice',
								state: {
									url: { searchInput },
									currentDeviceId: { currentDeviceId },
								},
							}}>
							<button>Link to the New Device</button>
						</Link>
						<button>Send to Connections</button>
						<button type='submit'>Generate the Key</button>
					</form>
				</div>
			) : (
				<>
					<KeyGeneratedScreen generatedCode={generatedCode} />
					<button type='button' onClick={onToggleMoveToTextButton}>
						Move to the Text Input Screen
					</button>
				</>
			)}
			<Link to='/code'>
				<button type='button' onClick={onMoveToInputKeyScreen}>
					Move to the Input Key Screen
				</button>
			</Link>
		</div>
	);
}
export default TextInputScreen;
