from flask_socketio import SocketIO, emit
from flask import Flask, request
from scipy import ndimage
import numpy as np
import cv2
import cairo
import base64
import random

# Plot Image
def plot_image(image_path):
  img_color = np.float32(cv2.imread(image_path) / 255.0)
  img_rgb = cv2.cvtColor(img_color, cv2.COLOR_BGR2RGB)

  return img_rgb

# 2D Gaussian Filter
def create_gaussian_filter(image, sigma):
    ksize = int(np.ceil(sigma)+1)
    fil = cv2.getGaussianKernel(ksize, sigma) # 1D kernel
    fil = fil*np.transpose(fil) # 2D kernel by outer product
    return cv2.filter2D(image, -1, fil)

# Painting
def paint_layer(canvas, refference_img, radius, brush):
  #  a new set of strokes, initially empty (S)
  S = []
  
  # create a pointwise difference image (D)
  D = np.sqrt(np.sum((canvas - refference_img)**2, axis=-1))
  
  canvas_height, canvas_width, _ = canvas.shape
  grid = int(brush["grid_size"] * radius)  # stepsize grid
  
  # gradient is computed from the Sobelfiltered luminance
  luminance = 0.30*refference_img[:,:,0] + 0.59*refference_img[:,:,1] + 0.11*refference_img[:,:,2]
  
  gradient_x = ndimage.sobel(luminance,1)
  gradient_y = ndimage.sobel(luminance,0)
  
  for x in range(0, canvas_width, grid):
    for y in range(0, canvas_height, grid):
      
      M = D[y:y+grid, x:x+grid]
      area_err = M.sum()/(grid**2)
      
      if area_err > brush["approx_threshold"] :
        # Find the largest error point
        indices = np.argmax(M)
        y1, x1 = np.unravel_index(indices, M.shape)
        
        # make brush stroke
        s = make_spline_stroke(radius, x+x1, y+y1, refference_img, canvas, brush["min_stroke_length"], brush["max_stroke_length"], gradient_x, gradient_y)
        S.append(s)

  # paint all strokes in S on the canvas (randomorder)
  random.shuffle(S)
  
  cairo_canvas = cairo.ImageSurface(cairo.FORMAT_RGB24, canvas_width, canvas_height)
  canvas_context = cairo.Context(cairo_canvas)
  canvas_context.set_line_cap(cairo.LINE_CAP_ROUND)
  
  # set the line width
  line_width = canvas_context.device_to_user_distance(2 * radius, 2 * radius) 
  canvas_context.set_line_width(np.min(line_width))
  
  for s in S:
    paint_strokes(s, refference_img, canvas_context)

  return cairo_canvas


def paint_strokes(s, refference_img, canvas_context):
  stroke_color = (refference_img[s[0][0],s[0][1]])
  sy, sx = s[0]
  
  R,G,B = tuple(stroke_color)
  canvas_context.set_source_rgb(R, G, B)

  # start stroke path
  canvas_context.move_to(sx, sy)
  
  # draw lines
  for sy,sx in s:
    canvas_context.line_to(sx, sy)
    canvas_context.move_to(sx, sy)
    
  # end
  canvas_context.close_path()
  canvas_context.stroke()
  
  
def make_spline_stroke(radius, x0, y0, refference_img, canvas, min_stroke_length, max_stroke_length, gradient_x, gradient_y):
  # K = a new stroke with radius R and color strokeColor
  K = [(y0, x0)]
  x,y = x0, y0
  lastDx,lastDy = (0,0)
  
  # pointilism has a stroke len of 0, so add 1
  max_stroke_length += 1
  
  for i in range(1, max_stroke_length):
    canvas_color_diff = np.linalg.norm(refference_img[y,x] - canvas[y,x])
    stroke_color_diff = np.linalg.norm(refference_img[y,x] - refference_img[y0, x0])
    
    if (i > min_stroke_length and (canvas_color_diff < stroke_color_diff)):
      return K
    
    # detect vanishing gradient
    gx = gradient_x[y,x]
    gy = gradient_y[y,x]
    
    if (gx**2 + gy**2 == 0):
      return K

    # compute a normal direction
    dx,dy = (-gy, gx)

    # if necessary, reverse direction
    if (lastDx * dx + lastDy * dy < 0):
      dx,dy = -dx, -dy

    # filter the stroke direction
    curvature_filter = 1
    dx, dy = curvature_filter*(dx,dy) + (1-curvature_filter)*(lastDx,lastDy)
    dx, dy = (dx, dy) / np.sqrt(dx**2 + dy**2)

    x, y =  (x + radius*dx, y + radius*dy)
    
    # round up x, y
    x = int(round(x))
    y = int(round(y))
    
    if x >= refference_img.shape[1] or y >= refference_img.shape[0]:
      return K
    
    lastDx,lastDy = (dx,dy)

    # add the point (x,y) to K
    K.append((y,x))
    
  return K


def encode_layer_as_png(layer):
    success, buffer = cv2.imencode('.png', layer)
    if not success:
        raise ValueError("Failed to encode image to PNG format")

    encoded_image = base64.b64encode(buffer).decode('utf-8')
    return encoded_image
  

def paint_layers(source_img, brush):
  im_height, im_width, _ = source_img.shape
  print(brush)
  blur_img = np.zeros((len(brush["brush_sizes"]), im_height, im_width, 3))

  for i, radius in enumerate(brush["brush_sizes"]):
    blur = create_gaussian_filter(source_img, brush["blur_filter"]*radius)
    reference_image = source_img * blur
    blur_img[i] = reference_image
    
  source_img = cv2.cvtColor(source_img, cv2.COLOR_BGR2RGB)

  # paint a layer
  num_layers = len(brush["brush_sizes"])
  layer_img = np.zeros((num_layers, im_height, im_width, 3), dtype=np.uint8)

  for i, radius in enumerate(brush["brush_sizes"]):
    reference_image = blur_img[i]

    cairo_canvas = paint_layer(source_img, reference_image, radius, brush)
    cairo_canvas.write_to_png("out.png")
    
    layer_img[i] = np.ndarray(shape=(im_height, im_width, 4),
                       dtype=np.uint8,
                       buffer=cairo_canvas.get_data())[:, :, 0:3]
    
    socketio = SocketIO(Flask(__name__), cors_allowed_origins="*")
    socketio.emit('layer_update', {'layer_index': i, 'layer_data': encode_layer_as_png(layer_img[i])})
    
    print("layer painted")
  
  # cv2.imshow("image", layer_img[num_layers-1])
  # cv2.waitKey(0)
  return {"message": "Painting complete"}

