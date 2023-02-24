import React from 'react'

const TextDivider = ({children}) => {
  return (
    <div className="relative flex items-center py-5">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        <span className="flex-shrink mx-4 text-gray-400 dark:border-gray-500">{children}</span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
    </div>
  )
}

export default TextDivider