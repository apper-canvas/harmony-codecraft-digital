import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('Edit')

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
<motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel mx-4 mt-4 rounded-2xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-glow">
                <ApperIcon name="Code" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  CodeCraft
                </h1>
                <p className="text-sm text-surface-600 dark:text-surface-300">
                  Transform text into code
                </p>
              </div>
</motion.div>

            <div className="flex items-center space-x-4">
              {/* Edit/Error Tabs */}
              <div className="flex bg-surface-100/50 dark:bg-surface-800/50 rounded-xl p-1 backdrop-blur-sm">
                <motion.button
                  onClick={() => setActiveTab('Edit')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === 'Edit'
                      ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-soft'
                      : 'text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  Edit
</motion.button>
                <motion.button
                  onClick={() => setActiveTab('error')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === 'error'
                      ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-soft'
                      : 'text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  Error
                </motion.button>
              </div>

              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 transition-colors duration-300 shadow-soft"
              >
                <ApperIcon 
                  name={isDarkMode ? "Sun" : "Moon"} 
                  className="w-5 h-5 text-surface-600 dark:text-surface-300" 
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
{/* Main Content */}
<main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <MainFeature activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-20 py-12 border-t border-surface-200 dark:border-surface-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <ApperIcon name="Zap" className="w-5 h-5 text-primary-500" />
              <span className="text-surface-600 dark:text-surface-300">
                Powered by modern web technologies
              </span>
            </div>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              © 2024 CodeCraft. Transforming text into code, one line at a time.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home