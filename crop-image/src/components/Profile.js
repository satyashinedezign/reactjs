import React, { useEffect, useState } from "react";


const Profile = (props) => {
	const [image, setImage] = useState();
	useEffect(() => {
		console.log('test', props)
		setImage(props.image);
		console.log('test2', props)
	},[props]);

	// useEffect(() => {
	// 	setImage(props.image);
	// });

	const removeProfile = () => {
		setImage(props.defaultImage);
	}

	const downloadProfile = () => {
		
		// const previewUrl = window.URL.createObjectURL(blob);
		// const anchor = document.createElement("a");
		// anchor.download = "image.jpeg";
		// anchor.href = URL.createObjectURL(blob);
		// anchor.click();

		// window.URL.revokeObjectURL(previewUrl);
	}
	
	
    return (
        <div className="col-md-6 col-6">
            <div className="cropped-image-container">
                <div className="preview-image">
                    <img src={image} />
					<div className="links">
						<a className="remove-profile-pic" href="#" title="Remove Profile" onClick={removeProfile}>Remove</a>
						<a className="download-profile-pic" href="#" title="Download Profile" onClick={downloadProfile}>Download</a>
					</div>
                </div>
            </div>
        </div>
    )
}

export default Profile;