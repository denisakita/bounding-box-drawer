import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchImages, loadImageData, uploadImage } from "../services/imageService";
import './LandingPage.css';

const LandingPage: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const navigate = useNavigate();

    // Fetch images on component mount
    useEffect(() => {
        const loadImages = async () => {
            try {
                const fetchedImages = await fetchImages();
                setImages(fetchedImages);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };
        loadImages();
    }, []);

    // Handle image upload
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                await uploadImage(file);
                setSelectedImage(file);
                const imageUrl = URL.createObjectURL(file);
                navigate('/editor', { state: { imageUrl, imageName: file.name } });
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    };

    // Load image and its bounding boxes, then navigate to editor
    const loadImage = async (imageName: string) => {
        try {
            const { imageUrl, boundingBoxes } = await loadImageData(imageName);
            navigate('/editor', { state: { imageUrl, imageName, boundingBoxes } });
        } catch (error) {
            console.error('Error loading image and bounding boxes:', error);
        }
    };

    return (
        <div className="container">
            <h1>Bounding Box Drawer</h1>

            {/* File input for uploading images */}
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
            />

            <h2>Saved Images</h2>

            {/* List of saved images */}
            <ul>
                {images.map(image => (
                    <li key={image}>
                        <button onClick={() => loadImage(image)}>
                            {image}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LandingPage;
