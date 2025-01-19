import React from 'react'

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) { return null }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between">
            {title && <h2>{title}</h2>}
            <button className="modal-close-btn" onClick={onClose}>X</button>
        </div>
        {children}
      </div>
    </div>
  )
}
