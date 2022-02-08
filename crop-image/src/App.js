import React, { useState } from "react";
import UploadImage from "./components/UploadImage";
import './Style.css';

const App = () => {
    return (
        <div className="container">
            <h3 className="text-center">Cropped Profile Image</h3>
            <div className="row">
                <UploadImage />
            </div>
        </div>
    )
}

export default App;
