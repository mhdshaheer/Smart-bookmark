'use client'

import React from 'react'
import Button from './ui/Button'
import Card from './ui/Card'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title }: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />
      
      <Card 
        className="w-full max-w-md p-8 shadow-2xl animate-scale-up" 
        showDecoration={false}
      >
        {/* Technical Deco */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
        
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-foreground uppercase tracking-tight mb-2">
            Delete Bookmark?
          </h3>
          <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
            Are you sure you want to remove <span className="text-foreground font-bold">"{title}"</span>? This action cannot be undone.
          </p>
          
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="py-3"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={onConfirm}
              className="py-3"
            >
              Confirm Delete
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Safe Action</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase">Verification Required</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
