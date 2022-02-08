import React, { useRef, useState } from "react";
import "./App.css";

import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import { generateDownload } from "./components/CroppedImage";
import defaultImage from "./components/images/avatar.png";

const App = () => {
	const inputRef = useRef();
	const triggerFileSelectPopup = () => inputRef.current.click();
	const [image, setImage] = useState(null);
	const [croppedArea, setCroppedArea] = useState(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);

	const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
		console.log('croppedAreaPercentage', croppedAreaPercentage)
		console.log('px', croppedAreaPixels)
		setCroppedArea(croppedAreaPixels);
	};

	const onSelectFile = (event) => {
		if (event.target.files && event.target.files.length > 0) {
			const reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]);
			reader.addEventListener("load", () => {
				setImage(reader.result);
			});
		}
	};

	const onDownload = () => {
		console.log('image', image)
		console.log('croppedArea', croppedArea)
		// generateDownload(image, croppedArea);
	};

	return (
		<div className='container'>
			<div className='container-cropper'>
				{image ? (
					<>
						<div className='cropper'>
							<Cropper
								image={image}
								crop={crop}
								zoom={zoom}
								aspect={0.5}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropComplete}
							/>
						</div>

						<div className='slider'>
							<Slider
								min={1}
								max={3}
								step={0.1}
								value={zoom}
								onChange={(e, zoom) => setZoom(zoom)}
							/>
						</div>
					</>
				) : <img src={defaultImage} />}
			</div>

			<div className='container-buttons'>
				<input
					type='file'
					accept='image/*'
					ref={inputRef}
					onChange={onSelectFile}
					style={{ display: "none" }}
				/>
				<Button
					variant='contained'
					color='primary'
					onClick={triggerFileSelectPopup}
					style={{ marginRight: "10px" }}
				>
					Choose
				</Button>
				<Button variant='contained' color='secondary' onClick={onDownload}>
					Download
				</Button>
			</div>
		</div>
	)
}

export default App;
