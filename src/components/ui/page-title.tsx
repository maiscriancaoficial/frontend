import React from 'react'

interface PageTitleProps {
  title: string
  subtitle?: string
}

export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-base md:text-lg text-gray-600">{subtitle}</p>
      )}
    </div>
  )
}
