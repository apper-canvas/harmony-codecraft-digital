import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
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
  processedCode,
  setProcessedCode,
  activeSubTab,
  setActiveSubTab
}) => {
const editTab = activeSubTab
  
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
              editTab === 'input'
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
              editTab === 'changes'
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
{editTab === 'input' && (
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
          isActive={editTab === 'input'}
        />
      )}
{editTab === 'changes' && (
<EditChangesTab 
          text={changesText}
          setText={setChangesText}
          processedCode={processedCode}
          setProcessedCode={setProcessedCode}
          isActive={editTab === 'changes'}
          changesTab={editOutputTab}
          setChangesTab={setEditOutputTab}
        />
      )}
    </motion.div>
  )
}
export default EditTab