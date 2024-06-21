import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {fetchImages, loadImageData, uploadImage} from "../services/imageService";
import './LandingPage.css';


const LandingPage: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadImages = async () => {
            const images = await fetchImages();
            setImages(images);
        };
        loadImages();
    }, []);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            await uploadImage(file);
            setSelectedImage(file);
            const imageUrl = URL.createObjectURL(file);
            navigate('/editor', {state: {imageUrl, imageName: file.name}});
        }
    };

    const loadImage = async (imageName: string) => {
        try {
            const {imageUrl, boundingBoxes} = await loadImageData(imageName);
            navigate('/editor', {state: {imageUrl, imageName, boundingBoxes}});
        } catch (error) {
            console.error('Error loading image and bounding boxes:', error);
        }
    };

    return (
        <div className="container">
            <h1>Bounding Box Drawer</h1>
            <input type="file" accept="image/*" onChange={handleImageUpload}/>
            <h2>Saved Images</h2>
            <ul>
                {images.map(image => (
                    <li key={image}>
                        <button onClick={() => loadImage(image)}>{image}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LandingPage;
