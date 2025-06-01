import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { Editor } from '@monaco-editor/react'
import ApperIcon from './ApperIcon'
import CodeEditor from './CodeEditor'
const MainFeature = ({ activeTab, setActiveTab }) => {
  
  // Sub-tab state for Edit and Error tabs
  const [editSubTab, setEditSubTab] = useState('input')
  const [errorSubTab, setErrorSubTab] = useState('input')
  
  // Error tab state variables
  const [inputTab, setInputTab] = useState('request')
  const [inputText, setInputText] = useState('')
  const [processedFiles, setProcessedFiles] = useState('')
  const [parsedData, setParsedData] = useState(null)
  const [text, setText] = useState('')
  const [processedText, setProcessedText] = useState('')
  const [changesTab, setChangesTab] = useState('input')
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState({ lines: 0, words: 0, characters: 0 })
  
  // Edit tab state variables
  const [editInputTab, setEditInputTab] = useState('request')
  const [editInputText, setEditInputText] = useState('')
  const [editProcessedFiles, setEditProcessedFiles] = useState('')
  const [editParsedData, setEditParsedData] = useState(null)
  const [editText, setEditText] = useState('')
  const [editProcessedText, setEditProcessedText] = useState('')
  const [editChangesTab, setEditChangesTab] = useState('input')
  const [editIsProcessing, setEditIsProcessing] = useState(false)
  const [editStats, setEditStats] = useState({ lines: 0, words: 0, characters: 0 })
  
  // Scroll position management
  const [inputTabScrollPosition, setInputTabScrollPosition] = useState(0)
  const [changesTabScrollPosition, setChangesTabScrollPosition] = useState(0)
  const [editInputTabScrollPosition, setEditInputTabScrollPosition] = useState(0)
  const [editChangesTabScrollPosition, setEditChangesTabScrollPosition] = useState(0)
  
  // Refs for scroll management
  const inputTabRef = useRef(null)
  const changesTabRef = useRef(null)
  const editInputTabRef = useRef(null)
  const editChangesTabRef = useRef(null)

const handleInputProcess = async () => {
    setIsProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (inputText.trim()) {
      try {
        // Parse the JSON input
        const parsed = JSON.parse(inputText)
        
        // Process the fileContent to remove LineNumber prefixes
        let cleanedContent = ''
        if (parsed.fileContent) {
          cleanedContent = processFileContent(parsed.fileContent)
        }
        
        // Store parsed data with cleaned content
        setParsedData({
          ...parsed,
          cleanedContent
        })
        
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

// Edit tab handler functions
  const handleEditInputProcess = async () => {
    setEditIsProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (editInputText.trim()) {
      try {
        // Parse the JSON input
        const parsed = JSON.parse(editInputText)
        
        // Process the fileContent to remove LineNumber prefixes
        let cleanedContent = ''
        if (parsed.fileContent) {
          cleanedContent = processFileContent(parsed.fileContent)
        }
        
        // Store parsed data with cleaned content
        setEditParsedData({
          ...parsed,
          cleanedContent
        })
        
        setEditInputTab('files') // Switch to Actual Files tab automatically
        toast.success('Request processed successfully!')
      } catch (error) {
        toast.error('Invalid JSON format. Please check your input.')
      }
    } else {
      toast.warning('Please enter some request text to process')
    }
    
    setEditIsProcessing(false)
  }

  const handleEditProcessInput = async () => {
    if (!editText.trim()) {
      toast.error('Please enter some text to transform')
      return
    }

    setEditIsProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const extractedText = extractAllTextValues(editText)
    setEditProcessedCode(extractedText || "No valid text found")
    setEditProcessingStats({
      lineCount: (extractedText || editText).split('\n').length,
      processingTime: 1500,
      codeType: getLanguageFromContent(extractedText || editText)
    })
    
    setEditIsProcessing(false)
    setEditChangesTab('output')
    
    if (extractedText) {
      toast.success('Successfully extracted text content!')
    } else {
      toast.warning('No valid text patterns found in input')
    }
  }

  const handleEditCopyCode = () => {
    navigator.clipboard.writeText(editProcessedCode)
    toast.success('Code copied to clipboard!')
  }

  const handleEditClearAll = () => {
    setEditText('')
    setEditProcessedCode('')
    setEditProcessingStats({ lineCount: 0, processingTime: 0, codeType: 'html' })
    toast.info('Workspace cleared')
  }

  const handleEditCodeChange = (newCode) => {
    setEditProcessedCode(newCode)
    setEditProcessingStats(prev => ({
      ...prev,
      lineCount: newCode.split('\n').length
    }))
  }

  // Save scroll position when switching away from a tab
  const saveScrollPosition = (tabName) => {
    if (tabName === 'edit' && editInputTabRef.current) {
      setEditInputTabScrollPosition(editInputTabRef.current.scrollTop)
    } else if (tabName === 'error' && inputTabRef.current) {
      setInputTabScrollPosition(inputTabRef.current.scrollTop)
    } else if (tabName === 'changes' && changesTabRef.current) {
      setChangesTabScrollPosition(changesTabRef.current.scrollTop)
    }
  }

  // Restore scroll position when switching to a tab
  const restoreScrollPosition = (tabName) => {
    if (tabName === 'edit' && editInputTabRef.current) {
      editInputTabRef.current.scrollTop = editInputTabScrollPosition
    } else if (tabName === 'error' && inputTabRef.current) {
      inputTabRef.current.scrollTop = inputTabScrollPosition
    } else if (tabName === 'changes' && changesTabRef.current) {
      changesTabRef.current.scrollTop = changesTabScrollPosition
    }
  }

  // Helper function to process fileContent and remove LineNumber prefixes
  const processFileContent = (fileContent) => {
    const lines = fileContent.split('\n')
    const cleanedLines = lines.map(line => {
      // Remove LineNumber:X: prefix from each line
      const match = line.match(/^LineNumber:\d+:(.*)$/)
      return match ? match[1] : line
    })
    return cleanedLines.join('\n')
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (text.trim()) {
      setProcessedText(text)
      setChangesTab('output') // Switch to Code Output tab automatically
      
      // Calculate stats
      const lines = text.split('\n').length
      const words = text.trim().split(/\s+/).filter(word => word.length > 0).length
      const characters = text.length
      setStats({ lines, words, characters })
      
      toast.success('Text processed successfully!')
    } else {
      toast.warning('Please enter some text to process')
    }
    
    setIsProcessing(false)
    return 'plaintext'
  }

  // Handle Monaco Editor mount
  const handleEditorDidMount = (editor, monaco) => {
    codeEditorRef.current = editor
    // Configure additional editor options if needed
    editor.updateOptions({
      wordWrap: 'on',
      automaticLayout: true
    })
  }

  // Check if dark mode is enabled
  const isDarkMode = document.documentElement.classList.contains('dark') || 
                     document.body.classList.contains('dark') ||
                     window.matchMedia('(prefers-color-scheme: dark)').matches

// Extract text values from input using the provided function
  function extractAllTextValues(input) {
    const lines = input.split('\n');
    let extractedTexts = [];

    lines.forEach(line => {
        if (line.trim().startsWith("data: ")) {
            const jsonStr = line.trim().slice(6); // Remove "data: " prefix
            try {
                const obj = JSON.parse(jsonStr);
                const content = obj?.choices?.[0]?.delta?.content;

                // Include all string content, even empty or newline
                if (typeof content === "string") {
                    extractedTexts.push(content);
                }
            } catch (e) {
                console.warn("Skipping malformed JSON line:", line);
            }
        }
    });

return extractedTexts.join('');
  }

// Effect to restore scroll position when switching to edit tab
  useEffect(() => {
    if (activeTab === 'edit') {
      setTimeout(() => {
        restoreScrollPosition('edit')
      }, 100) // Small delay to ensure DOM is updated
    }
  }, [activeTab, editInputTabScrollPosition])

  // Effect to restore scroll position when switching to error tab
  useEffect(() => {
    if (activeTab === 'error') {
      setTimeout(() => {
        restoreScrollPosition('error')
      }, 100) // Small delay to ensure DOM is updated
    }
  }, [activeTab, inputTabScrollPosition])

  // Effect to restore scroll position when switching to changes tab
  useEffect(() => {
    if (activeTab === 'changes') {
      setTimeout(() => {
        restoreScrollPosition('changes')
      }, 100) // Small delay to ensure DOM is updated
    }
  }, [activeTab, changesTabScrollPosition])

// Additional state variables needed for Error tab
  const [processedCode, setProcessedCode] = useState('')
  const [processingStats, setProcessingStats] = useState({ lineCount: 0, processingTime: 0, codeType: 'html' })
  const [editorSettings, setEditorSettings] = useState({ 
    showLineNumbers: true, 
    enableFolding: true, 
    fontSize: 14, 
    showErrors: true 
  })
  const [collapsedBlocks, setCollapsedBlocks] = useState(new Set())
  const codeEditorRef = useRef(null)

  // Additional state variables needed for Edit tab
  const [editProcessedCode, setEditProcessedCode] = useState('')
  const [editProcessingStats, setEditProcessingStats] = useState({ lineCount: 0, processingTime: 0, codeType: 'html' })
  const [editEditorSettings, setEditEditorSettings] = useState({ 
    showLineNumbers: true, 
    enableFolding: true, 
    fontSize: 14, 
    showErrors: true 
  })
  const [editCollapsedBlocks, setEditCollapsedBlocks] = useState(new Set())
  const editCodeEditorRef = useRef(null)
const handleProcessInput = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to transform')
      return
    }

    setIsProcessing(true)
    
    // Simulate processing delay
await new Promise(resolve => setTimeout(resolve, 1500))
    
    const extractedText = extractAllTextValues(text)
    setProcessedCode(extractedText || "No valid text found")
    setProcessingStats({
      lineCount: (extractedText || text).split('\n').length,
      processingTime: 1500,
      codeType: getLanguageFromContent(extractedText || text)
    })
    
    setIsProcessing(false)
    setChangesTab('output')
    
    if (extractedText) {
      toast.success('Successfully extracted text content!')
    } else {
      toast.warning('No valid text patterns found in input')
    }
  }

  // Get language from content
  const getLanguageFromContent = (content) => {
    if (content.includes('<html') || content.includes('<!DOCTYPE')) return 'html'
    if (content.includes('function') || content.includes('const ') || content.includes('let ')) return 'javascript'
    if (content.includes('def ') || content.includes('import ')) return 'python'
if (content.includes('{') && content.includes(':')) return 'json'
    return 'plaintext'
  }

const handleCopyCode = () => {
    navigator.clipboard.writeText(processedCode)
    toast.success('Code copied to clipboard!')
  }
  const handleClearAll = () => {
    setText('')
    setProcessedCode('')
    setProcessingStats({ lineCount: 0, processingTime: 0, codeType: 'html' })
    toast.info('Workspace cleared')
  }

  const handleCodeChange = (newCode) => {
    setProcessedCode(newCode)
    setProcessingStats(prev => ({
      ...prev,
      lineCount: newCode.split('\n').length
    }))
  }

  const toggleCodeBlock = (lineIndex) => {
    setCollapsedBlocks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(lineIndex)) {
        newSet.delete(lineIndex)
      } else {
        newSet.add(lineIndex)
      }
      return newSet
    })
  }

  // Generate line numbers
  const lineNumbers = processedCode.split('\n').map((_, index) => index + 1)
  // Simple syntax highlighting
  const highlightSyntax = (code) => {
    return code
      .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)/g, '<span class="syntax-html">$1$2</span>')
      .replace(/\b(function|const|let|var|if|else|for|while|class|return|import|export)\b/g, '<span class="syntax-keyword">$1</span>')
      .replace(/"([^"]*)"/g, '<span class="syntax-string">"$1"</span>')
.replace(/\/\/(.*?)$/gm, '<span class="syntax-comment">//$1</span>')
  }

return (
    <>
      <div className="space-y-6">
{/* Tab Content */}

        {/* Edit Tab Content */}
        {activeTab === 'Edit' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            {/* Sub-Tab Navigation for Edit */}
            <div className="glass-panel p-2 mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditSubTab('input')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    editSubTab === 'input'
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
                  onClick={() => setEditSubTab('changes')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    editSubTab === 'changes'
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
            {editSubTab === 'input' && (
              <motion.div
                ref={editInputTabRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-h-screen overflow-y-auto custom-scrollbar"
              >
                {/* Input Section Tabs */}
                <div className="glass-panel flex space-x-2 mb-6 p-2">
                  <button
                    onClick={() => setEditInputTab('request')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      editInputTab === 'request' 
                        ? 'bg-primary-500 text-white shadow-lg' 
                        : 'bg-transparent text-surface-700 hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    Request
                  </button>
                  <button
                    onClick={() => setEditInputTab('files')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      editInputTab === 'files' 
                        ? 'bg-primary-500 text-white shadow-lg' 
                        : 'bg-transparent text-surface-700 hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    Actual Files
                  </button>
                </div>

                {/* Input Tab Content */}
                {editInputTab === 'request' ? (
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
                              value={editInputText}
                              onChange={(e) => setEditInputText(e.target.value)}
                              onPaste={(e) => {
                                // Auto-process after paste with small delay to ensure content is set
                                setTimeout(() => {
                                  handleEditInputProcess()
                                }, 1000)
                              }}
                              placeholder="Enter your request text here..."
                              className="w-full h-64 p-6 bg-white bg-opacity-50 border border-surface-300 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-surface-800 placeholder-surface-500 backdrop-blur-sm"
                              style={{ fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace' }}
                            />
                            <div className="absolute bottom-4 right-4 text-xs text-surface-500">
                              {editInputText.length} characters
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEditInputProcess}
                      disabled={editIsProcessing}
                      className="w-full py-4 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {editIsProcessing ? (
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
                        {editProcessedFiles && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigator.clipboard.writeText(editProcessedFiles)}
                            className="p-2 bg-surface-100 hover:bg-surface-200 rounded-lg transition-colors"
                            title="Copy to clipboard"
                          >
                            <ApperIcon name="Copy" className="w-4 h-4 text-surface-600" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                    
                    {editParsedData ? (
                      <div className="space-y-6">
                        {/* Metadata Display */}
                        <div className="bg-surface-50 rounded-xl border border-surface-200 p-6">
                          <h4 className="text-lg font-semibold text-surface-800 mb-4">File Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-surface-600 mb-1">File Path:</label>
                              <p className="text-surface-800 bg-white px-3 py-2 rounded border font-mono text-sm">
                                {editParsedData.filePath || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-surface-600 mb-1">File Type:</label>
                              <p className="text-surface-800 bg-white px-3 py-2 rounded border font-mono text-sm">
                                {editParsedData.fileType || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-surface-600 mb-1">App ID:</label>
                              <p className="text-surface-800 bg-white px-3 py-2 rounded border font-mono text-sm">
                                {editParsedData.appId || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-surface-600 mb-1">Syntax Error Summary:</label>
                              <p className="text-surface-800 bg-white px-3 py-2 rounded border font-mono text-sm">
                                {editParsedData.syntaxErrorSummary || 'No errors'}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-surface-600 mb-1">Syntax Errors:</label>
                              <p className="text-surface-800 bg-white px-3 py-2 rounded border font-mono text-sm">
                                {editParsedData.syntaxErrors || 'None'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Code Editor */}
                        <div className="bg-surface-50 rounded-xl overflow-hidden border border-surface-200">
                          <div className="bg-surface-100 px-4 py-2 border-b border-surface-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-surface-700">
                                {editParsedData.filePath ? editParsedData.filePath.split('/').pop() : 'processed-file'}
                              </span>
                              <div className="flex items-center space-x-2 text-xs text-surface-500">
                                <span>{editParsedData.fileType || 'Text'}</span>
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <Editor
                              height="400px"
                              language={getLanguageFromContent(editParsedData.cleanedContent || '')}
                              value={editParsedData.cleanedContent || ''}
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
            )}

            {/* Changes Sub-Tab Content */}
            {editSubTab === 'changes' && (
              <motion.div
                ref={editChangesTabRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-h-screen overflow-y-auto custom-scrollbar"
              >
                {/* Inner Tab Bar for Changes */}
                <div className="glass-panel p-2 mb-6">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditChangesTab('input')}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        editChangesTab === 'input'
                          ? 'bg-primary-500 text-white shadow-glow'
                          : 'bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="FileText" className="w-4 h-4" />
                        <span>Streaming Response</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setEditChangesTab('output')}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        editChangesTab === 'output'
                          ? 'bg-primary-500 text-white shadow-glow'
                          : 'bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Code2" className="w-4 h-4" />
                        <span>Actual Response</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Input Text Tab */}
                {editChangesTab === 'input' && (
                  <div className="glass-panel p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                      <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4 sm:mb-0">
                        Streaming Response
                      </h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-surface-600 dark:text-surface-300">
                          {editText.length} characters
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleEditClearAll}
                          className="px-4 py-2 text-sm bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600 rounded-lg transition-colors duration-300"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder="Enter your text here... Try lists, key-value pairs, or any text content!"
                        className="neu-input w-full h-32 sm:h-40 resize-none focus:outline-none text-surface-900 dark:text-surface-100 dark:bg-surface-800 dark:border-surface-600"
                        rows={6}
                      />
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleEditProcessInput}
                        disabled={editIsProcessing || !editText.trim()}
                        className="neu-button w-full sm:w-auto bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all duration-300"
                      >
                        <div className="flex items-center justify-center space-x-3">
                          {editIsProcessing ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <ApperIcon name="Loader" className="w-5 h-5" />
                              </motion.div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <ApperIcon name="Play" className="w-5 h-5" />
                              <span>Get Actual Response</span>
                            </>
                          )}
                        </div>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Code Output Tab */}
                {editChangesTab === 'output' && (
                  <>
                    {/* Code Editor */}
                    <CodeEditor
                      code={editProcessedCode}
                      onChange={handleEditCodeChange}
                      onCopy={handleEditCopyCode}
                      language={getLanguageFromContent(editProcessedCode)}
                      isDarkMode={isDarkMode}
                    />
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Error Tab Content */}
        {activeTab === 'error' && (
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
            {errorSubTab === 'input' && (
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
                          <h4 className="text-lg font-semibold text-surface-800 mb-4">File Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-surface-600 mb-1">File Path:</label>
                              <p className="text-surface-800 bg-white px-3 py-2 rounded border font-mono text-sm">
                                {parsedData.filePath || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-surface-600 mb-1">File Type:</label>
                              <p className="text-surface-800 bg-white px-3 py-2 rounded border font-mono text-sm">
                                {parsedData.fileType || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-surface-600 mb-1">App ID:</label>
                              <p className="text-surface-800 bg-white px-3 py-2 rounded border font-mono text-sm">
                                {parsedData.appId || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-surface-600 mb-1">Syntax Error Summary:</label>
                              <p className="text-surface-800 bg-white px-3 py-2 rounded border font-mono text-sm">
                                {parsedData.syntaxErrorSummary || 'No errors'}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-surface-600 mb-1">Syntax Errors:</label>
                              <p className="text-surface-800 bg-white px-3 py-2 rounded border font-mono text-sm">
                                {parsedData.syntaxErrors || 'None'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Code Editor */}
                        <div className="bg-surface-50 rounded-xl overflow-hidden border border-surface-200">
                          <div className="bg-surface-100 px-4 py-2 border-b border-surface-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-surface-700">
                                {parsedData.filePath ? parsedData.filePath.split('/').pop() : 'processed-file'}
                              </span>
                              <div className="flex items-center space-x-2 text-xs text-surface-500">
                                <span>{parsedData.fileType || 'Text'}</span>
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <CodeEditor
                              code={parsedData.cleanedContent || ''}
                              onChange={() => {}}
                              onCopy={() => navigator.clipboard.writeText(parsedData.cleanedContent || '')}
                              language={getLanguageFromContent(parsedData.cleanedContent || '')}
                              isDarkMode={isDarkMode}
                              readOnly={true}
                            />
                          </div>
                        </div>
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
            )}

            {/* Changes Sub-Tab Content */}
            {errorSubTab === 'changes' && (
              <motion.div
                ref={changesTabRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-h-screen overflow-y-auto custom-scrollbar"
              >
                {/* Inner Tab Bar for Changes */}
                <div className="glass-panel p-2 mb-6">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setChangesTab('input')}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        changesTab === 'input'
                          ? 'bg-primary-500 text-white shadow-glow'
                          : 'bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="FileText" className="w-4 h-4" />
                        <span>Streaming Response</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setChangesTab('output')}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        changesTab === 'output'
                          ? 'bg-primary-500 text-white shadow-glow'
                          : 'bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Code2" className="w-4 h-4" />
                        <span>Actual Response</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Input Text Tab */}
                {changesTab === 'input' && (
                  <div className="glass-panel p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                      <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4 sm:mb-0">
                        Streaming Response
                      </h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-surface-600 dark:text-surface-300">
                          {text.length} characters
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleClearAll}
                          className="px-4 py-2 text-sm bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600 rounded-lg transition-colors duration-300"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your text here... Try lists, key-value pairs, or any text content!"
                        className="neu-input w-full h-32 sm:h-40 resize-none focus:outline-none text-surface-900 dark:text-surface-100 dark:bg-surface-800 dark:border-surface-600"
                        rows={6}
                      />
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleProcessInput}
                        disabled={isProcessing || !text.trim()}
                        className="neu-button w-full sm:w-auto bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all duration-300"
                      >
                        <div className="flex items-center justify-center space-x-3">
                          {isProcessing ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <ApperIcon name="Loader" className="w-5 h-5" />
                              </motion.div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <ApperIcon name="Play" className="w-5 h-5" />
                              <span>Get Actual Response</span>
                            </>
                          )}
                        </div>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Code Output Tab */}
                {changesTab === 'output' && (
                  <>
                    {/* Code Editor */}
                    <CodeEditor
                      code={processedCode}
                      onChange={handleCodeChange}
                      onCopy={handleCopyCode}
                      language={getLanguageFromContent(processedCode)}
                      isDarkMode={isDarkMode}
                    />
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </>
  )
}

export default MainFeature