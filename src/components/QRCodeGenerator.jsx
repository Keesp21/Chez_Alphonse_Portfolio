import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

function QRCodeGenerator({ url, size = 200 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: {
          dark: '#DAA520', // Primary color
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) console.error('QR Code generation error:', error)
      })
    }
  }, [url, size])

  return <canvas ref={canvasRef} className="rounded-lg" />
}

export default QRCodeGenerator

