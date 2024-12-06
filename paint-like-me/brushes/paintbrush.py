# defines brush properties

class paintbrush:
    def __init__(self, brush_sizes, blur_filter, grid_size, approx_threshold, min_stroke_length, max_stroke_length):
        self.brush_sizes = brush_sizes
        self.blur_filter = blur_filter
        self.grid_size = grid_size
        self.approx_threshold = approx_threshold
        self.min_stroke_length = min_stroke_length
        self.max_stroke_length = max_stroke_length
        