from brushes.paintbrush import paintbrush

pointillism = paintbrush(
    brush_sizes = [4, 2],
    blur_filter = 20,
    grid_size = 0.5,
    approx_threshold = 0.05,
    min_stroke_length = 0,
    max_stroke_length = 0
)

impressionism = paintbrush(
    brush_sizes=[8, 4, 2],
    blur_filter=10,
    grid_size=1,
    approx_threshold=0.05,
    min_stroke_length=2,
    max_stroke_length=16
)

expressionism = paintbrush(
    brush_sizes=[8, 4, 2],
    blur_filter=5,
    grid_size=1,
    approx_threshold=0.05,
    min_stroke_length=10,
    max_stroke_length=16
)


brushes = {
    "Pointillism": pointillism,
    "Impressionism": impressionism,
    "Expressionism": expressionism
}
