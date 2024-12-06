import { React, useState } from 'react';

function PaintBrushes() {
    const [selectedValue, setSelectedValue] = useState('Pointillism');

    const handleChange = async (value) => {
        setSelectedValue(value);

        try {
            const response = await fetch('/select-brush', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ brushType: value }),
            });

            if (!response.ok) {
                console.error('Failed to update brush type.');
            }
        } catch (error) {
            console.error('Error updating brush type:', error);
        }
    };

    return (
        <form>
            <label>
                <input type="radio" value="Pointillism" checked={selectedValue === 'Pointillism'} onChange={() => handleChange('Pointillism')} />
                Pointillism
            </label>
            <label>
                <input type="radio" value="Impressionism" checked={selectedValue === 'Impressionism'} onChange={() => handleChange('Impressionism')} />
                Impressionism
            </label>
            <label>
                <input type="radio" value="Expressionism" checked={selectedValue === 'Expressionism'} onChange={() => handleChange('Expressionism')} />
                Expressionism
            </label>
        </form>
    );

}

export default PaintBrushes;