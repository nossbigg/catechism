import React from 'react'
import { Helmet } from 'react-helmet'

interface DocumentTitleProps {
  title: string
}

export const DocumentTitle: React.FC<DocumentTitleProps> = ({ title }) => {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  )
}
