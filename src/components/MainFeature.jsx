import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import EditTab from './tabs/EditTab'
import ErrorTab from './tabs/ErrorTab'

const MainFeature = ({ activeTab, setActiveTab }) => {
  // Persistent state for Edit tab
  const [editInputText, setEditInputText] = useState(() => {
    return localStorage.getItem('editInputText') || ''
  })
  const [editParsedData, setEditParsedData] = useState(() => {
    const saved = localStorage.getItem('editParsedData')
    return saved ? JSON.parse(saved) : null
  })
  const [editCodebaseFiles, setEditCodebaseFiles] = useState(() => {
    const saved = localStorage.getItem('editCodebaseFiles')
    return saved ? JSON.parse(saved) : []
  })
  const [editActiveFileTab, setEditActiveFileTab] = useState(() => {
    return parseInt(localStorage.getItem('editActiveFileTab') || '0')
  })
  const [editChangesText, setEditChangesText] = useState(() => {
    return localStorage.getItem('editChangesText') || ''
  })
  const [editProcessedCode, setEditProcessedCode] = useState(() => {
    return localStorage.getItem('editProcessedCode') || ''
  })

  // Persistent state for Error tab
  const [errorInputText, setErrorInputText] = useState(() => {
    return localStorage.getItem('errorInputText') || ''
  })
  const [errorParsedData, setErrorParsedData] = useState(() => {
    const saved = localStorage.getItem('errorParsedData')
    return saved ? JSON.parse(saved) : null
  })
  const [errorChangesText, setErrorChangesText] = useState(() => {
    return localStorage.getItem('errorChangesText') || ''
  })
  const [errorProcessedCode, setErrorProcessedCode] = useState(() => {
    return localStorage.getItem('errorProcessedCode') || ''
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('editInputText', editInputText)
  }, [editInputText])

  useEffect(() => {
    localStorage.setItem('editParsedData', JSON.stringify(editParsedData))
  }, [editParsedData])

  useEffect(() => {
    localStorage.setItem('editCodebaseFiles', JSON.stringify(editCodebaseFiles))
  }, [editCodebaseFiles])

  useEffect(() => {
    localStorage.setItem('editActiveFileTab', editActiveFileTab.toString())
  }, [editActiveFileTab])

  useEffect(() => {
    localStorage.setItem('editChangesText', editChangesText)
  }, [editChangesText])

  useEffect(() => {
    localStorage.setItem('editProcessedCode', editProcessedCode)
  }, [editProcessedCode])

  useEffect(() => {
    localStorage.setItem('errorInputText', errorInputText)
  }, [errorInputText])

  useEffect(() => {
    localStorage.setItem('errorParsedData', JSON.stringify(errorParsedData))
  }, [errorParsedData])

  useEffect(() => {
    localStorage.setItem('errorChangesText', errorChangesText)
  }, [errorChangesText])

  useEffect(() => {
    localStorage.setItem('errorProcessedCode', errorProcessedCode)
  }, [errorProcessedCode])

  return (
    <div className="space-y-6">
      {/* Tab Content */}
      
      {/* Edit Tab Content */}
      {activeTab === 'edit' && (
        <EditTab 
          inputText={editInputText}
          setInputText={setEditInputText}
          parsedData={editParsedData}
          setParsedData={setEditParsedData}
          codebaseFiles={editCodebaseFiles}
          setCodebaseFiles={setEditCodebaseFiles}
          activeFileTab={editActiveFileTab}
          setActiveFileTab={setEditActiveFileTab}
          changesText={editChangesText}
          setChangesText={setEditChangesText}
          processedCode={editProcessedCode}
          setProcessedCode={setEditProcessedCode}
        />
      )}

      {/* Error Tab Content */}
      {activeTab === 'error' && (
        <ErrorTab 
          inputText={errorInputText}
          setInputText={setErrorInputText}
          parsedData={errorParsedData}
          setParsedData={setErrorParsedData}
          changesText={errorChangesText}
          setChangesText={setErrorChangesText}
          processedCode={errorProcessedCode}
          setProcessedCode={setErrorProcessedCode}
/>
      )}
    </div>
  )
}

export default MainFeature