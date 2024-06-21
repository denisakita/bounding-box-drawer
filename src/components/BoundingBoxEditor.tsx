import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {fetchBoundingBoxes, saveBoundingBoxes} from '../services/boundingBoxService';
import './BoundingBoxEditor.css';
import {BoundingBox} from "../models/boundingBox";


const BoundingBoxEditor: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {imageUrl, imageName} = location.state as { imageUrl: string; imageName: string };
    const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
    const [drawing, setDrawing] = useState<boolean>(false);
    const [currentBox, setCurrentBox] = useState<BoundingBox | null>(null);
    const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

    // Load bounding boxes for the image when component mounts or image changes
    useEffect(() => {
        const loadBoundingBoxes = async () => {
            const boxes = await fetchBoundingBoxes(imageName);
            setBoundingBoxes(boxes);
        };
        loadBoundingBoxes();
    }, [imageName]);

    // Draw image and bounding boxes on canvas when image or boundingBoxes change
    useEffect(() => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            setLoadedImage(img);
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                renderBoundingBoxes(ctx, boundingBoxes);
            }
        };
    }, [imageUrl, boundingBoxes]);

    // Render bounding boxes on canvas
    const renderBoundingBoxes = (ctx: CanvasRenderingContext2D, boxes: BoundingBox[]) => {
        if (loadedImage) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(loadedImage, 0, 0);
            boxes.forEach(box => {
                ctx.strokeStyle = box.id === selectedBoxId ? 'blue' : 'red';
                ctx.lineWidth = 2;
                ctx.strokeRect(box.x, box.y, box.width, box.height);
                drawResizeHandles(ctx, box);
            });
        }
    };

    // Draw resize handles for a bounding box
    const drawResizeHandles = (ctx: CanvasRenderingContext2D, box: BoundingBox) => {
        const handleSize = 8;
        ctx.fillStyle = 'blue';

        const corners = [
            {x: box.x, y: box.y}, // Top-left
            {x: box.x + box.width, y: box.y}, // Top-right
            {x: box.x, y: box.y + box.height}, // Bottom-left
            {x: box.x + box.width, y: box.y + box.height} // Bottom-right
        ];

        corners.forEach(corner => {
            ctx.beginPath();
            ctx.arc(corner.x, corner.y, handleSize / 2, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    // Handle mouse down event on canvas
    const handleMouseDown = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setStartPos({x, y});

            if (selectedBoxId !== null) {
                const box = boundingBoxes.find(box => box.id === selectedBoxId);
                if (box && isNearEdge(x, y, box)) {
                    setDrawing(true);
                    setCurrentBox(box);
                    return;
                }
            }

            // Check if clicked inside an existing box or create a new box
            const clickedBox = boundingBoxes.find(box => x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height);
            if (clickedBox) {
                setSelectedBoxId(clickedBox.id);
            } else {
                setSelectedBoxId(null);
                const newBox = {id: Date.now(), x, y, width: 0, height: 0};
                setDrawing(true);
                setCurrentBox(newBox);
            }
        }
    };

    // Handle mouse move event on canvas
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!drawing || !currentBox || !startPos) return;
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const updatedBox = {...currentBox, width: x - currentBox.x, height: y - currentBox.y};
            setCurrentBox(updatedBox);

            const ctx = canvas.getContext('2d');
            if (ctx && loadedImage) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.drawImage(loadedImage, 0, 0);
                renderBoundingBoxes(ctx, [...boundingBoxes.filter(box => box.id !== currentBox.id), updatedBox]);
            }
        }
    };

    const handleMouseUp = () => {
        if (drawing && currentBox) {
            if (currentBox.width !== 0 && currentBox.height !== 0) {
                setBoundingBoxes(prev => [...prev.filter(box => box.id !== currentBox.id), currentBox]);
            }
            setCurrentBox(null);
            setDrawing(false);
        }
        setStartPos(null);
    };

    // Check if a point (x, y) is near the edge of a box
    const isNearEdge = (x: number, y: number, box: BoundingBox): boolean => {
        const margin = 8;
        const nearLeft = Math.abs(x - box.x) < margin;
        const nearRight = Math.abs(x - (box.x + box.width)) < margin;
        const nearTop = Math.abs(y - box.y) < margin;
        const nearBottom = Math.abs(y - (box.y + box.height)) < margin;

        return nearLeft || nearRight || nearTop || nearBottom;
    };

    // Handle click on a bounding box
    const handleBoxClick = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const clickedBox = boundingBoxes.find(box =>
                x >= box.x && x <= box.x + box.width &&
                y >= box.y && y <= box.y + box.height
            );
            if (clickedBox) setSelectedBoxId(clickedBox.id);
        }
    };

    // Delete the selected box
    const deleteSelectedBox = () => {
        if (selectedBoxId !== null) {
            setBoundingBoxes(prev => prev.filter(box => box.id !== selectedBoxId));
            setSelectedBoxId(null);
        }
    };

    // Save bounding boxes to backend
    const saveBoundingBoxesHandler = async () => {
        await saveBoundingBoxes(imageName, boundingBoxes);
    };

    return (
        <div className="canvas-container">
            <h3 className="canvas-title">{imageName}</h3>
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onClick={handleBoxClick}
                className="canvas"
            ></canvas>
            <div className="button-container">
                <button className="button" onClick={saveBoundingBoxesHandler}>Save</button>
                <button className="button" onClick={deleteSelectedBox}>Delete selected box</button>
                <button className="button close" onClick={() => navigate('/')}>Close image</button>
            </div>
        </div>
    );
};

export default BoundingBoxEditor;
