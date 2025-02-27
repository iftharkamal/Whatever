import React from 'react'

const ColorPicker = ({colors,handleDragStart}) => {
  return (
    <div>
      <div className="flex flex-col gap-4 px-10  h-full w-[3%] items-center justify-center border-r border-r-gray-300">
          {colors.map((color) => (
            <div
              key={color}
              draggable
              onDragStart={() => handleDragStart(color)}
              className="w-8 h-8 rounded-full  cursor-grab shadow-sm"
              style={{
                backgroundColor: color,
              }}
            ></div>
          ))}
        </div>
        
    </div>
  )
}

export default ColorPicker
