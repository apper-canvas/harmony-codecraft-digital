import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { Editor } from '@monaco-editor/react'
import ApperIcon from './ApperIcon'

function MainFeature() {
const [inputText, setInputText] = useState('')
  const [processedCode, setProcessedCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('input')
const [editorSettings, setEditorSettings] = useState({
    showLineNumbers: true,
    theme: 'light',
    fontSize: 14,
    enableFolding: true,
    showErrors: false
  })
const [processingStats, setProcessingStats] = useState({
    lineCount: 0,
    processingTime: 0,
codeType: 'html'
  })
  const [collapsedBlocks, setCollapsedBlocks] = useState(new Set())
const codeEditorRef = useRef(null)
  // Helper function to detect language from content
  const getLanguageFromContent = (content) => {
    if (content.includes('<html') || content.includes('<div') || content.includes('<span')) {
      return 'html'
    }
    if (content.includes('function') || content.includes('const') || content.includes('let') || content.includes('=>')) {
      return 'javascript'
    }
    if (content.includes('import React') || content.includes('jsx') || content.includes('<')) {
      return 'javascript'
    }
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

  const handleProcess = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to transform')
      return
    }

    setIsProcessing(true)
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const startTime = Date.now()
    const extractedText = extractAllTextValues(inputText)
    const processingTime = Date.now() - startTime
    
    // Handle case where no valid text is found
    const finalOutput = extractedText || "No valid text found"
    
    setProcessedCode(finalOutput)
    setProcessingStats({
      lineCount: finalOutput.split('\n').length,
      processingTime: processingTime,
      codeType: 'text'
    })
    
    setIsProcessing(false)
    
    if (extractedText) {
      toast.success('Successfully extracted text content!')
    } else {
      toast.warning('No valid text patterns found in input')
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(processedCode)
    toast.success('Code copied to clipboard!')
  }

  const handleClearAll = () => {
    setInputText('')
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
      {/* Tab Bar and Content */}
      <div className="glass-panel p-6 sm:p-8">
        {/* Tab Bar */}
        <div className="flex space-x-1 mb-6 bg-surface-100 dark:bg-surface-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'input'
                ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-surface-600 dark:text-surface-300 hover:text-surface-800 dark:hover:text-surface-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <ApperIcon name="Edit3" className="w-4 h-4" />
              <span>Input</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'output'
                ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-surface-600 dark:text-surface-300 hover:text-surface-800 dark:hover:text-surface-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <ApperIcon name="Code2" className="w-4 h-4" />
              <span>Output</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4 sm:mb-0">
                  Input Text
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
                <div className="neu-input p-0 overflow-hidden bg-surface-50 dark:bg-surface-800 rounded-xl">
                  <Editor
                    height="300px"
                    language="plaintext"
                    value={inputText}
                    onChange={(value) => setInputText(value || '')}
                    theme={isDarkMode ? 'vs-dark' : 'light'}
                    options={{
                      fontSize: editorSettings.fontSize,
                      lineNumbers: editorSettings.showLineNumbers ? 'on' : 'off',
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
                      validate: false,
                      renderValidationDecorations: 'off'
                    }}
                    loading={
                      <div className="flex items-center justify-center h-72">
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
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProcess}
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
                        <span>Transform to Code</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'output' && (
            <motion.div
              key="output"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4 sm:mb-0">
                  Code Output
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
                        Enter some text in the Input tab and click "Transform to Code"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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

    </motion.div>
  )
}

export default MainFeature