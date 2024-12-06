import numpy as np
import cv2
import os

path = os.path.join(os.getcwd(), 'uploaded-pictures')

# ==== Brush Properties ====
brush_sizes = [4, 2]
blur_filter = 20
grid_size = 0.5
approx_threshold = 0.05
min_stroke_length = 0
max_stroke_length = 0

def get_image_path(filename):
    return os.path.join(path, filename)

def process_image(filename):
    image_path = get_image_path(filename)
    if os.path.exists(image_path):
        print(f"Processing image: {image_path}")
        return image_path 
    else:
        print("Image not found!")
        return None


layer_img = paint(source_img, brush_sizes, blur_filter, grid_size, approx_threshold, min_stroke_length, max_stroke_length)
