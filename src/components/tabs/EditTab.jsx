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
  setProcessedCode
}) => {
  const [editTab, setEditTab] = useState(() => {
    return localStorage.getItem('editActiveSubTab') || 'input'
  })

  const handleTabChange = (tab) => {
    setEditTab(tab)
    localStorage.setItem('editActiveSubTab', tab)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Edit Section Tabs */}
      <div className="glass-panel p-2">
        <div className="flex space-x-2">
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
              <span>Changes</span>
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
        />
      )}
      {editTab === 'changes' && (
<EditChangesTab 
          text={changesText}
          setText={setChangesText}
          processedCode={processedCode}
          setProcessedCode={setProcessedCode}
        />
      )}
    </motion.div>
  )
}
export default EditTab