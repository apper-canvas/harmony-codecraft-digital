import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { Editor } from '@monaco-editor/react'
import ApperIcon from '../../ApperIcon'

const EditInputTab = ({ 
  inputText, 
  setInputText, 
  parsedData, 
  setParsedData, 
  codebaseFiles, 
  setCodebaseFiles, 
  activeFileTab, 
  setActiveFileTab 
}) => {
  const [inputTab, setInputTab] = useState('request')
  const [processedFiles, setProcessedFiles] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
const inputTabRef = useRef(null)

  // Save scroll position when component becomes inactive
  useEffect(() => {
    const saveScroll = () => {
      if (inputTabRef.current) {
        setScrollPosition(inputTabRef.current.scrollTop)
      }
    }

    if (!isActive) {
      saveScroll()
    }
  }, [isActive])

// Restore scroll position when component mounts
  useEffect(() => {
    if (inputTabRef.current && scrollPosition > 0) {
      setTimeout(() => {
        inputTabRef.current.scrollTop = scrollPosition
      }, 100)
    }
  }, [scrollPosition])

  // Helper function to process codebase files
  const processFileContent = (fileContent) => {
    const lines = fileContent.split('\n')
    const cleanedLines = lines.map(line => {
      // Remove LineNumber:X: prefix from each line
      const match = line.match(/^LineNumber:\d+:(.*)$/)
      return match ? match[1] : line
    })
    return cleanedLines.join('\n')
  }

// Parse codebase string to extract individual files
  const parseCodebase = (codebaseString) => {
    const files = []
    
    // Remove code block markers if present
    const cleanCodebase = codebaseString.replace(/^```|```$/g, '').trim()
    
    // Split by FileName: to get individual file sections
    const fileSections = cleanCodebase.split(/(?=FileName:)/).filter(section => section.trim())
    
    for (const section of fileSections) {
      const lines = section.split('\n')
      let fileName = null
      const fileContent = []
      
      for (const line of lines) {
        if (line.startsWith('FileName:')) {
          fileName = line.replace('FileName:', '').trim()
        } else if (line.startsWith('LineNumber:')) {
          // Extract content after LineNumber:X: (split at second colon)
          const colonIndex = line.indexOf(':', line.indexOf(':') + 1)
          const content = colonIndex !== -1 ? line.substring(colonIndex + 1) : ''
          fileContent.push(content)
        }
      }
      
      if (fileName && fileContent.length > 0) {
        files.push({
          name: fileName,
          content: fileContent.join('\n')
        })
      }
    }
    
    return files
  }
const handleInputProcess = async () => {
    setIsProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (inputText.trim()) {
      try {
        // Parse the JSON input
        const parsed = JSON.parse(inputText)
        
        // Parse codebase to extract individual files
        let files = []
        if (parsed.codebase) {
          files = parseCodebase(parsed.codebase)
        }
        
        // Store parsed data with extracted files
        setParsedData(parsed)
        setCodebaseFiles(files)
        setActiveFileTab(0) // Reset to first file
        
        setInputTab('files') // Switch to Actual Files tab automatically
        toast.success('Request processed successfully!')
      } catch (error) {
        toast.error('Invalid JSON format. Please check your input.')
      }
    } else {
      toast.warning('Please enter some request text to process')
    }
    
    setIsProcessing(false)
  }

  // Get language from content
  const getLanguageFromContent = (content) => {
    if (content.includes('<html') || content.includes('<!DOCTYPE')) return 'html'
    if (content.includes('function') || content.includes('const ') || content.includes('let ')) return 'javascript'
    if (content.includes('def ') || content.includes('import ')) return 'python'
    if (content.includes('{') && content.includes(':')) return 'json'
    return 'plaintext'
  }

  // Check if dark mode is enabled
  const isDarkMode = document.documentElement.classList.contains('dark') || 
                     document.body.classList.contains('dark') ||
                     window.matchMedia('(prefers-color-scheme: dark)').matches

  return (
    <motion.div
      ref={inputTabRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-h-screen overflow-y-auto custom-scrollbar"
    >
      {/* Input Section Tabs */}
      <div className="glass-panel flex space-x-2 mb-6 p-2">
        <button
          onClick={() => setInputTab('request')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
            inputTab === 'request' 
              ? 'bg-primary-500 text-white shadow-lg' 
              : 'bg-transparent text-surface-700 hover:bg-white hover:bg-opacity-20'
          }`}
        >
          Request
        </button>
        <button
          onClick={() => setInputTab('files')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
            inputTab === 'files' 
              ? 'bg-primary-500 text-white shadow-lg' 
              : 'bg-transparent text-surface-700 hover:bg-white hover:bg-opacity-20'
          }`}
        >
          Actual Files
        </button>
      </div>

      {/* Input Tab Content */}
      {inputTab === 'request' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 glass-panel rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-surface-800">
              Request Input
            </h3>
            <div className="flex items-center space-x-2 text-sm text-surface-600">
              <ApperIcon name="Type" className="w-4 h-4" />
              <span>Enter your request</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-3">
                  Request Text
                </label>
                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onPaste={(e) => {
                      // Auto-process after paste with small delay to ensure content is set
                      setTimeout(() => {
                        handleInputProcess()
                      }, 1000)
                    }}
                    placeholder="Enter your request text here..."
                    className="w-full h-64 p-6 bg-white bg-opacity-50 border border-surface-300 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-surface-800 placeholder-surface-500 backdrop-blur-sm"
                    style={{ fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace' }}
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-surface-500">
                    {inputText.length} characters
                  </div>
                </div>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleInputProcess}
            disabled={isProcessing}
            className="w-full py-4 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ApperIcon name="Loader2" className="w-5 h-5" />
                </motion.div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <ApperIcon name="Play" className="w-5 h-5" />
                <span>Process Request</span>
              </>
            )}
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 glass-panel rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-surface-800">
              Actual Files
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-surface-600">
                <ApperIcon name="FileText" className="w-4 h-4" />
                <span>Processed files</span>
              </div>
              {processedFiles && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigator.clipboard.writeText(processedFiles)}
                  className="p-2 bg-surface-100 hover:bg-surface-200 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <ApperIcon name="Copy" className="w-4 h-4 text-surface-600" />
                </motion.button>
              )}
            </div>
          </div>
          
{parsedData ? (
            <div className="space-y-6">
              {/* Metadata Display */}
              <div className="bg-surface-50 rounded-xl border border-surface-200 p-6">
                <h4 className="text-lg font-semibold text-surface-800 mb-4">Request Information</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-600 mb-1">Query:</label>
                    <p className="text-surface-800 bg-white px-3 py-2 rounded border text-sm">
                      {parsedData.query || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-600 mb-1">File List:</label>
                    <pre className="text-surface-800 bg-white px-3 py-2 rounded border text-sm whitespace-pre-wrap font-mono">
                      {parsedData.file_list || 'N/A'}
                    </pre>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-600 mb-1">App ID:</label>
                    <p className="text-surface-800 bg-white px-3 py-2 rounded border font-mono text-sm">
                      {parsedData.appId || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Codebase Files Display */}
              {codebaseFiles.length > 0 && (
                <div className="bg-surface-50 rounded-xl border border-surface-200">
                  <div className="bg-surface-100 px-4 py-2 border-b border-surface-200">
                    <h4 className="text-lg font-semibold text-surface-800">Codebase Files</h4>
                  </div>
                  
                  {/* File Tabs */}
                  <div className="flex overflow-x-auto bg-surface-100 border-b border-surface-200">
                    {codebaseFiles.map((file, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveFileTab(index)}
                        className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-r border-surface-200 transition-colors ${
                          activeFileTab === index
                            ? 'bg-white text-primary-600 border-b-2 border-primary-600'
                            : 'text-surface-600 hover:text-surface-800 hover:bg-surface-50'
                        }`}
                      >
                        {file.name}
                      </button>
                    ))}
                  </div>
{/* Monaco Editor for Active File */}
                  <div className="relative">
                    <Editor
                      height="500px"
                      language={getLanguageFromContent(codebaseFiles[activeFileTab]?.content || '')}
                      value={codebaseFiles[activeFileTab]?.content || ''}
                      theme={isDarkMode ? 'vs-dark' : 'vs-light'}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineHeight: 20,
                        fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
                        wordWrap: 'on',
                        lineNumbers: 'on',
                        folding: true,
                        automaticLayout: true
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-surface-50 rounded-xl border-2 border-dashed border-surface-300 p-12 text-center">
              <ApperIcon name="FileText" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-surface-600 mb-2">No files processed yet</h4>
              <p className="text-surface-500">Process a request to see the generated files here.</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

export default EditInputTab