import os
import secrets
from flask import Flask, jsonify, request, send_from_directory, session
from werkzeug.utils import secure_filename
from brushes.brushes import brushes
from painting.paint import *

app = Flask(__name__)
app.secret_key = secrets.token_hex(24)

path = os.path.join(os.getcwd(), 'uploaded-pictures')

# Running app
if __name__ == '__main__':
    app.run(debug=True)

# Define app routes
@app.route('/upload', methods = ['POST'])   
def file_upload():   
    if request.method == 'POST':
        if not os.path.isdir(path):
            os.mkdir(path)   
        
        file = request.files['file']
        filename = secure_filename(file.filename)
        image_path = os.path.join(path, filename)
        file.save(image_path)
        session['image_path'] = image_path
        print(session['image_path'] + "is the session image path")
        
        image_url = f'http://localhost:3000/uploaded-pictures/{filename}'
        
        return jsonify({'message': 'Image uploaded!', 'image_url': image_url})

@app.route('/uploaded-pictures/<filename>')
def uploaded_file(filename):
    return send_from_directory(path, filename)


@app.route('/select-brush', methods=['POST', 'GET'])
def select_brush():
    if request.method == 'POST':
        data = request.json
        brush_type = data.get('brushType')
        selected_brush = brushes[brush_type]
        
        brush_data = {
            "brush_sizes": selected_brush.brush_sizes,
            "blur_filter": selected_brush.blur_filter,
            "grid_size": selected_brush.grid_size,
            "approx_threshold": selected_brush.approx_threshold,
            "min_stroke_length": selected_brush.min_stroke_length,
            "max_stroke_length": selected_brush.max_stroke_length,
        }
        session['brush_data'] = brush_data   
        return jsonify({"message": "Brush type updated successfully", "brush_data": brush_data})
    
    elif request.method == 'GET':
        brush_type = session.get('brush_data')
        
        if not brush_type:
            return jsonify({"error": "No brush selected"}), 400

        return jsonify({"message": "Got brush type successfully", "brush_data": brush_type}), 200
            
            
@app.route('/paint', methods=['POST'])
def paint():
    brush_data = request.json.get('brushData')['brush_data']
    image_path = session.get('image_path')
    
    print(image_path)
    
    if not os.path.exists(image_path):
        return jsonify({'error': 'Uploaded image not found'}), 404
    
    # call paint function
    source_img = plot_image(image_path)
    painting = paint_layers(source_img, brush_data)
    
    cv2.imshow("painting", painting)
    cv2.waitKey(0)
    
    _, buffer = cv2.imencode('.png', painting)
    encoded_painting = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({'message': 'painting complete', 'painting': encoded_painting}), 200
