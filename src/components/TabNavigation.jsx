import { motion } from 'framer-motion'
import ApperIcon from './ApperIcon'

function TabNavigation({ activeTab, setActiveTab, saveScrollPosition }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Tab Bar */}
      <div className="floating-tabs p-2">
        <div className="flex space-x-2">
<button
            onClick={() => {
              saveScrollPosition(activeTab)
              setActiveTab('edit')
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'edit'
                ? 'bg-primary-500 text-white shadow-glow'
                : 'bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="Edit" className="w-4 h-4" />
              <span>Edit</span>
            </div>
          </button>
          <button
            onClick={() => {
              saveScrollPosition(activeTab)
              setActiveTab('error')
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'error'
                ? 'bg-primary-500 text-white shadow-glow'
                : 'bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="AlertCircle" className="w-4 h-4" />
              <span>Error</span>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default TabNavigation