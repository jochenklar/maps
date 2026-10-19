import React from 'react'

// the positions of the bubbles on the circle, in percent of the size of the svg
const bubbles = [[50, 10], [90, 50], [50, 90], [10, 50]]

// a circle with small bubbles and a dot in the center, similar to the bi-crosshair icon,
// the geometry is relative to the svg, its size, color, stroke width and the radius
// of the dot and the bubbles are set in app.scss
const Crosshair = () => {
  return (
    <svg className="crosshair position-absolute top-50 start-50 translate-middle pe-none">
      <circle cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" />
      <circle className="crosshair-dot" cx="50%" cy="50%" fill="currentColor" />
      {
        bubbles.map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`} className="crosshair-bubble"
            cx={`${cx}%`} cy={`${cy}%`} fill="currentColor"
          />
        ))
      }
    </svg>
  )
}

export default Crosshair
