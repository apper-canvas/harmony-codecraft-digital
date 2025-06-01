import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { Editor } from '@monaco-editor/react'
import ApperIcon from './ApperIcon'

function MainFeature() {
const [activeTab, setActiveTab] = useState('input')
  const [inputTab, setInputTab] = useState('request')
  const [inputText, setInputText] = useState('')
  const [processedFiles, setProcessedFiles] = useState('')
  const [text, setText] = useState('')
  const [processedText, setProcessedText] = useState('')
  const [changesTab, setChangesTab] = useState('input')
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState({ lines: 0, words: 0, characters: 0 })
const handleInputProcess = async () => {
    setIsProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (inputText.trim()) {
      setProcessedFiles(inputText)
      setInputTab('files') // Switch to Actual Files tab automatically
      
      toast.success('Request processed successfully!')
    } else {
      toast.warning('Please enter some request text to process')
    }
    
    setIsProcessing(false)
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
// Extract text values from input using the provided function
  function extractAllTextValues(input) {
    const lines = input.split('\n');
    let extractedTexts = [];

    lines.forEach(line => {
        if (line.trim()) {
            try {
                const parsed = JSON.parse(line);
                if (parsed && parsed.content) {
                    extractedTexts.push(parsed.content);
                }
            } catch (e) {
                console.warn("Skipping malformed JSON line:", line);
            }
        }
    });

    return extractedTexts.join('');
return extractedTexts.join('');
  }

  // Additional state variables needed
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

  const handleProcessInput = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to transform')
      return
    }

    setIsProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const extractedText = extractAllTextValues(inputText)
    setProcessedCode(extractedText || inputText)
    setProcessingStats({
      lineCount: (extractedText || inputText).split('\n').length,
      processingTime: 1500,
      codeType: getLanguageFromContent(extractedText || inputText)
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
      .replace(/\b(\d+)\b/g, '<span class="syntax-number">$1</span>')
      .replace(/\/\/(.*?)$/gm, '<span class="syntax-comment">//$1</span>')
  }

return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="space-y-8"
    >
{/* Tab Bar */}
      <div className="glass-panel p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('input')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'input'
                ? 'bg-primary-500 text-white shadow-glow'
                : 'bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="Files" className="w-4 h-4" />
              <span>Input</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('changes')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'changes'
                ? 'bg-primary-500 text-white shadow-glow'
                : 'bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="GitBranch" className="w-4 h-4" />
              <span>Changes</span>
            </div>
          </button>
        </div>
      </div>

      {/* Input Tab Content */}
      {activeTab === 'input' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          {/* Input Section Tabs */}
          <div className="flex space-x-2 mb-6 p-1 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
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
                  <label className="block text-sm font-medium text-surface-700 mb-3">
                    Request Text
                  </label>
                  <div className="relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Enter your request text here..."
                      className="w-full h-64 p-6 bg-white bg-opacity-50 border border-surface-300 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-surface-800 placeholder-surface-500 backdrop-blur-sm"
                      style={{ fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace' }}
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-surface-500">
                      {inputText.length} characters
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
              </div>
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
              
              {processedFiles ? (
                <div className="bg-surface-50 rounded-xl overflow-hidden border border-surface-200">
                  <div className="bg-surface-100 px-4 py-2 border-b border-surface-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-surface-700">output.txt</span>
                      <div className="flex items-center space-x-2 text-xs text-surface-500">
                        <span>Text</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <Editor
                      height="400px"
                      language="plaintext"
                      value={processedFiles}
                      theme="vs-light"
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

{/* Changes Tab Content */}
      {activeTab === 'changes' && (
        <>
          {/* Inner Tab Bar for Changes */}
          <div className="glass-panel p-2">
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
              {/* Processing Stats */}
              <AnimatePresence>
                {processedCode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-panel p-4 sm:p-6"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600">
                          {processingStats.lineCount}
                        </div>
                        <div className="text-sm text-surface-600 dark:text-surface-300">
                          Lines of Code
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary-600">
                          {processingStats.processingTime}ms
                        </div>
                        <div className="text-sm text-surface-600 dark:text-surface-300">
                          Processing Time
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent uppercase">
                          {processingStats.codeType}
                        </div>
                        <div className="text-sm text-surface-600 dark:text-surface-300">
                          Code Type
                        </div>
                      </div>
                      <div className="text-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleCopyCode}
                          className="mx-auto p-3 bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 rounded-xl transition-colors duration-300"
                        >
                          <ApperIcon name="Copy" className="w-5 h-5 text-surface-600 dark:text-surface-300" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Code Editor */}
              <div className="glass-panel p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4 sm:mb-0">
                    Actual Response
                  </h3>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editorSettings.showLineNumbers}
                        onChange={(e) => setEditorSettings(prev => ({ ...prev, showLineNumbers: e.target.checked }))}
                        className="rounded border-surface-300"
                      />
                      <span className="text-surface-600 dark:text-surface-300">Line Numbers</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editorSettings.enableFolding}
                        onChange={(e) => setEditorSettings(prev => ({ ...prev, enableFolding: e.target.checked }))}
                        className="rounded border-surface-300"
                      />
                      <span className="text-surface-600 dark:text-surface-300">Code Folding</span>
                    </label>
                    <select
                      value={editorSettings.fontSize}
                      onChange={(e) => setEditorSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                      className="px-3 py-1 text-sm bg-surface-100 dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg"
                    >
                      <option value={12}>12px</option>
                      <option value={14}>14px</option>
                      <option value={16}>16px</option>
                      <option value={18}>18px</option>
                    </select>
                  </div>
                </div>

                <div className="neu-input p-0 overflow-hidden bg-surface-50 dark:bg-surface-800 rounded-xl">
                  {processedCode ? (
                    <div className="min-h-96">
                      <Editor
                        height="400px"
                        language={getLanguageFromContent(processedCode)}
                        value={processedCode}
                        onChange={(value) => handleCodeChange(value || '')}
                        onMount={handleEditorDidMount}
                        theme={isDarkMode ? 'vs-dark' : 'light'}
                        options={{
                          fontSize: editorSettings.fontSize,
                          lineNumbers: editorSettings.showLineNumbers ? 'on' : 'off',
                          folding: editorSettings.enableFolding,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          wordWrap: 'on',
                          readOnly: false,
                          selectOnLineNumbers: true,
                          glyphMargin: false,
                          lineDecorationsWidth: 0,
                          lineNumbersMinChars: 3,
                          renderLineHighlight: 'line',
                          scrollbar: {
                            vertical: 'auto',
                            horizontal: 'auto',
                            useShadows: false,
                            verticalScrollbarSize: 8,
                            horizontalScrollbarSize: 8
                          },
                          bracketPairColorization: {
                            enabled: true
                          },
                          guides: {
                            bracketPairs: true,
                            indentation: true
                          },
                          validate: editorSettings.showErrors,
                          renderValidationDecorations: editorSettings.showErrors ? 'on' : 'off'
                        }}
                        loading={
                          <div className="flex items-center justify-center h-96">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <ApperIcon name="Loader" className="w-8 h-8 text-primary-500" />
                            </motion.div>
                          </div>
                        }
                      />
                    </div>
                  ) : (
                    <div className="min-h-96 flex items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <ApperIcon name="Code2" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                        </motion.div>
                        <p className="text-surface-500 dark:text-surface-400 text-lg">
                          Your transformed code will appear here
                        </p>
                        <p className="text-surface-400 dark:text-surface-500 text-sm mt-2">
                          Enter some text above and click "Get Actual Response"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}

{/* Changes Tab Content */}
      {activeTab === 'changes' && (
        <>
          {/* Inner Tab Bar for Changes */}
          <div className="glass-panel p-2">
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
              {inputText.length} characters
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
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here... Try lists, key-value pairs, or any text content!"
            className="neu-input w-full h-32 sm:h-40 resize-none focus:outline-none text-surface-900 dark:text-surface-100 dark:bg-surface-800 dark:border-surface-600"
            rows={6}
          />
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
onClick={handleProcessInput}
            disabled={isProcessing || !inputText.trim()}
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
              {/* Processing Stats */}
              <AnimatePresence>
{processedCode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-panel p-4 sm:p-6"
                  >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {processingStats.lineCount}
                </div>
                <div className="text-sm text-surface-600 dark:text-surface-300">
                  Lines of Code
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600">
                  {processingStats.processingTime}ms
                </div>
                <div className="text-sm text-surface-600 dark:text-surface-300">
                  Processing Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent uppercase">
                  {processingStats.codeType}
                </div>
                <div className="text-sm text-surface-600 dark:text-surface-300">
                  Code Type
                </div>
              </div>
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopyCode}
                  className="mx-auto p-3 bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 rounded-xl transition-colors duration-300"
                >
                  <ApperIcon name="Copy" className="w-5 h-5 text-surface-600 dark:text-surface-300" />
                </motion.button>
              </div>
            </div>
          </motion.div>
)}
              </AnimatePresence>

              {/* Code Editor */}
              <div className="glass-panel p-6 sm:p-8">
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4 sm:mb-0">
            Actual Response
          </h3>
<div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={editorSettings.showLineNumbers}
                onChange={(e) => setEditorSettings(prev => ({ ...prev, showLineNumbers: e.target.checked }))}
                className="rounded border-surface-300"
              />
              <span className="text-surface-600 dark:text-surface-300">Line Numbers</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={editorSettings.enableFolding}
                onChange={(e) => setEditorSettings(prev => ({ ...prev, enableFolding: e.target.checked }))}
                className="rounded border-surface-300"
/>
              <span className="text-surface-600 dark:text-surface-300">Code Folding</span>
            </label>
            <select
              value={editorSettings.fontSize}
              onChange={(e) => setEditorSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
              className="px-3 py-1 text-sm bg-surface-100 dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg"
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
            </select>
          </div>
        </div>

<div className="neu-input p-0 overflow-hidden bg-surface-50 dark:bg-surface-800 rounded-xl">
          {processedCode ? (
            <div className="min-h-96">
              <Editor
                height="400px"
                language={getLanguageFromContent(processedCode)}
                value={processedCode}
                onChange={(value) => handleCodeChange(value || '')}
                onMount={handleEditorDidMount}
                theme={isDarkMode ? 'vs-dark' : 'light'}
options={{
                  fontSize: editorSettings.fontSize,
                  lineNumbers: editorSettings.showLineNumbers ? 'on' : 'off',
                  folding: editorSettings.enableFolding,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  readOnly: false,
                  selectOnLineNumbers: true,
                  glyphMargin: false,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                  renderLineHighlight: 'line',
                  scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto',
                    useShadows: false,
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8
                  },
                  bracketPairColorization: {
                    enabled: true
                  },
                  guides: {
                    bracketPairs: true,
                    indentation: true
                  },
                  validate: editorSettings.showErrors,
                  renderValidationDecorations: editorSettings.showErrors ? 'on' : 'off'
                }}
                loading={
                  <div className="flex items-center justify-center h-96">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <ApperIcon name="Loader" className="w-8 h-8 text-primary-500" />
                    </motion.div>
                  </div>
                }
              />
            </div>
          ) : (
            <div className="min-h-96 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <ApperIcon name="Code2" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                </motion.div>
                <p className="text-surface-500 dark:text-surface-400 text-lg">
                  Your transformed code will appear here
</p>
                <p className="text-surface-400 dark:text-surface-500 text-sm mt-2">
                  Enter some text above and click "Get Actual Response"
                </p>
              </div>
            </div>
)}
        </div>
              </div>
            </>
          )}
        </>
      )}

    </motion.div>
  )
}

export default MainFeature