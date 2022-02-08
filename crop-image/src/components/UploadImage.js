import React, { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import Profile from "./Profile";
import avatar from './images/avatar.png';

const createImage = (url) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });
}

function getRadianAngle(degreeValue) {
	return (degreeValue * Math.PI) / 180;
}

const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    // set each dimensions to double largest dimension to allow for a safe area for the
    // image to rotate in without being clipped by canvas context
    canvas.width = safeArea;
    canvas.height = safeArea;

    // translate canvas context to a central location on image to allow rotating around the center.
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.translate(-safeArea / 2, -safeArea / 2);

    // draw rotated image and store data.
    ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // paste generated rotate image with correct offsets for x,y crop values.
    ctx.putImageData(
        data,
        0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
        0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
    );

    // As Base64 string
    // return canvas.toDataURL("image/jpeg");
    return canvas;
}

const UploadImage = () => {
    const inputRef = useRef();
    const [image, setImage] = useState(null);
    const [profile, setProfile] = useState(avatar);
    const cropSize = {
        width: 200,
        height: 200,
    };
    const [croppedArea, setCroppedArea] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [saveButton, setSaveButton] = useState(0);

    const triggerFileSelectPopup = () => {
        console.log('triggerFileSelectPopup');
        setSaveButton(0);
        return inputRef.current.click();
    }

    const onSelectFile = (event) => {
        console.log('selectfile');
		if (event.target.files && event.target.files.length > 0) {
			const reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]);
			reader.addEventListener("load", () => {
				setImage(reader.result);
                setSaveButton(1);
			});
		}
	};

    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        console.log('cropcomplete');
		setCroppedArea(croppedAreaPixels);
	};

    const onSave = async () => {
        console.log('on save');
		const canvas = await getCroppedImg(image, croppedArea);
		canvas.toBlob(
            (blob) => {
                const urlCreator = window.URL || window.webkitURL;
                const imageUrl = urlCreator.createObjectURL(blob);                
                setProfile(imageUrl);
            },
            "image/jpeg",
            0.66
        );
	};

    return (
        <div className="row">
            <Profile image={profile} defaultImage={avatar} />
            <div className="col-md-6 col-6">
                <div className="upload-image-container">
                    <input type="file" name="uploadImage" ref={inputRef} onChange={onSelectFile} className="d-none" accept="image/*"/>
                    {image ? (
                        <div className="image-preview">
                            <div className='cropper'>
                                <Cropper
                                    image={image}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    cropShape="round"
                                    cropSize={cropSize}
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
                        </div>
                    ) :  ''}
                    <a className="upload-btn" onClick={triggerFileSelectPopup}>Upload</a>
                    <a className={saveButton ? 'save-btn' : 'save-btn d-none'} onClick={onSave}>Save</a>
                </div>
            </div>
        </div>
    )
}

export default UploadImage;