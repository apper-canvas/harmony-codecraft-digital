import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../ApperIcon'
import CodeEditor from '../CodeEditor'
import EditInputTab from './nested/EditInputTab'
import EditChangesTab from './nested/EditChangesTab'
const EditTab = ({ 
  inputText,
  setInputText, 
  parsedData,
  setParsedData,
  codebaseFiles,
  setCodebaseFiles,
  activeFileTab,
  setActiveFileTab,
  changesText,
  setChangesText,
  setProcessedCode,
  activeSubTab,
  setActiveSubTab,
  changesTab,
  setChangesTab
}) => {
const [inputCode, setInputCode] = React.useState('')
  const [outputCode, setOutputCode] = React.useState('')
const [isLoading, setIsLoading] = React.useState(false)
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const [inputEditorSettings, setInputEditorSettings] = useState({ 
    showLineNumbers: true, 
    enableFolding: true, 
    fontSize: 14 
  })
  const [outputEditorSettings, setOutputEditorSettings] = useState({ 
    showLineNumbers: true, 
    enableFolding: true, 
    fontSize: 14 
  })

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedInputSettings = localStorage.getItem('editTabInputEditorSettings')
      if (savedInputSettings) {
        const parsed = JSON.parse(savedInputSettings)
        setInputEditorSettings(prev => ({ ...prev, ...parsed }))
      }
      
      const savedOutputSettings = localStorage.getItem('editTabOutputEditorSettings')
      if (savedOutputSettings) {
        const parsed = JSON.parse(savedOutputSettings)
        setOutputEditorSettings(prev => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.warn('Failed to load editor settings from localStorage:', error)
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('editTabInputEditorSettings', JSON.stringify({
        showLineNumbers: inputEditorSettings.showLineNumbers,
        fontSize: inputEditorSettings.fontSize,
        enableFolding: inputEditorSettings.enableFolding
      }))
    } catch (error) {
      console.warn('Failed to save input editor settings to localStorage:', error)
    }
  }, [inputEditorSettings.showLineNumbers, inputEditorSettings.fontSize, inputEditorSettings.enableFolding])

  useEffect(() => {
    try {
      localStorage.setItem('editTabOutputEditorSettings', JSON.stringify({
        showLineNumbers: outputEditorSettings.showLineNumbers,
        fontSize: outputEditorSettings.fontSize,
        enableFolding: outputEditorSettings.enableFolding
      }))
    } catch (error) {
      console.warn('Failed to save output editor settings to localStorage:', error)
    }
  }, [outputEditorSettings.showLineNumbers, outputEditorSettings.fontSize, outputEditorSettings.enableFolding])
  
  // Handle file input
  const [editInputTab, setEditInputTab] = useState('request')
  
  const handleTabChange = (tab) => {
    setActiveSubTab(tab)
  }
  const clearAll = () => {
    setInputText('')
    setParsedData(null)
    setCodebaseFiles([])
    setChangesText('')
    setProcessedCode('')
    setActiveFileTab(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
{/* Edit Section Tabs */}
      <div className="glass-panel p-2">
        <div className="flex justify-center space-x-2">
<button
            onClick={() => handleTabChange('input')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeSubTab === 'input'
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
              activeSubTab === 'changes'
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
{activeSubTab === 'input' && (
<EditInputTab 
          inputText={inputText}
          setInputText={setInputText}
          parsedData={parsedData}
          setParsedData={setParsedData}
          codebaseFiles={codebaseFiles}
          setCodebaseFiles={setCodebaseFiles}
          activeFileTab={activeFileTab}
          setActiveFileTab={setActiveFileTab}
clearAll={clearAll}
          isActive={activeSubTab === 'input'}
          inputTab={editInputTab}
          setInputTab={setEditInputTab}
          editorSettings={inputEditorSettings}
          setEditorSettings={setInputEditorSettings}
        />
      )}
{activeSubTab === 'changes' && (
        <EditChangesTab
          text={changesText}
          setText={setChangesText}
          setProcessedCode={setProcessedCode}
          changesTab={changesTab}
          setChangesTab={setChangesTab}
          editorSettings={outputEditorSettings}
          setEditorSettings={setOutputEditorSettings}
        />
      )}
    </motion.div>
  )
}
export default EditTab