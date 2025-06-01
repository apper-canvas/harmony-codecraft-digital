import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import ErrorInputTab from './nested/ErrorInputTab'
import ErrorChangesTab from './nested/ErrorChangesTab'

const ErrorTab = () => {
  // Sub-tab state for Error tab
  const [errorSubTab, setErrorSubTab] = useState('input')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      {/* Sub-Tab Navigation for Error */}
      <div className="glass-panel p-2 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setErrorSubTab('input')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              errorSubTab === 'input'
                ? 'bg-primary-500 text-white shadow-glow'
                : 'bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="FileText" className="w-4 h-4" />
              <span>Input</span>
            </div>
          </button>
          <button
            onClick={() => setErrorSubTab('changes')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              errorSubTab === 'changes'
                ? 'bg-primary-500 text-white shadow-glow'
                : 'bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="Code2" className="w-4 h-4" />
              <span>Changes</span>
            </div>
          </button>
        </div>
      </div>

      {/* Input Sub-Tab Content */}
      {errorSubTab === 'input' && <ErrorInputTab />}

      {/* Changes Sub-Tab Content */}
      {errorSubTab === 'changes' && <ErrorChangesTab />}
    </motion.div>
  )
}

export default ErrorTab