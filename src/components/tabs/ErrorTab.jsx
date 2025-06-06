import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import ErrorInputTab from './nested/ErrorInputTab'
import ErrorChangesTab from './nested/ErrorChangesTab'
const ErrorTab = ({ 
  inputText, 
  setInputText, 
  parsedData, 
  setParsedData,
  changesText,
  setChangesText,
  processedCode,
  setProcessedCode,
  activeSubTab,
  setActiveSubTab
}) => {
  // Editor settings state for error tab
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    showLineNumbers: true,
    enableFolding: true
  })

  // Load editor settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('errorTabEditorSettings')
      if (saved) {
        setEditorSettings(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Failed to load error tab editor settings:', error)
    }
  }, [])

  // Save editor settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('errorTabEditorSettings', JSON.stringify(editorSettings))
    } catch (error) {
      console.error('Failed to save error tab editor settings:', error)
    }
  }, [editorSettings])

const errorTab = activeSubTab
  const [errorInputTab, setErrorInputTab] = useState('request')
  const [errorOutputTab, setErrorOutputTab] = useState('input')
  
  const handleTabChange = (tab) => {
    setActiveSubTab(tab)
  }

  const clearAll = () => {
    setInputText('')
    setParsedData(null)
    setChangesText('')
    setProcessedCode('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
{/* Error Section Tabs */}
      <div className="glass-panel p-2">
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handleTabChange('input')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              errorTab === 'input'
                ? 'bg-primary-500 text-white shadow-glow'
                : 'bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="Upload" className="w-4 h-4" />
              <span>Input</span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('changes')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              errorTab === 'changes'
                ? 'bg-primary-500 text-white shadow-glow'
                : 'bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="GitCommit" className="w-4 h-4" />
              <span>Output</span>
            </div>
          </button>
        </div>
      </div>

{/* Tab Content */}
{errorTab === 'input' && (
<ErrorInputTab 
          inputText={inputText}
          setInputText={setInputText}
          parsedData={parsedData}
          setParsedData={setParsedData}
          clearAll={clearAll}
          isActive={errorTab === 'input'}
          inputTab={errorInputTab}
          setInputTab={setErrorInputTab}
          editorSettings={editorSettings}
          setEditorSettings={setEditorSettings}
        />
      )}
{errorTab === 'changes' && (
<ErrorChangesTab 
          text={changesText}
          setText={setChangesText}
          processedCode={processedCode}
          setProcessedCode={setProcessedCode}
          isActive={errorTab === 'changes'}
          changesTab={errorOutputTab}
          setChangesTab={setErrorOutputTab}
          editorSettings={editorSettings}
          setEditorSettings={setEditorSettings}
        />
      )}
    </motion.div>
  )
}

export default ErrorTab