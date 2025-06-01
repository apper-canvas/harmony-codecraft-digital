import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../../ApperIcon'
import CodeEditor from '../../CodeEditor'

const EditChangesTab = ({ text, setText, processedCode, setProcessedCode, isActive, changesTab, setChangesTab }) => {
const [isProcessing, setIsProcessing] = useState(false)
  const [processingStats, setProcessingStats] = useState({ lineCount: 0, processingTime: 0, codeType: 'html' })
  const [scrollPosition, setScrollPosition] = useState(0)
  
  const changesTabRef = useRef(null)

  // Save scroll position when component becomes inactive
  useEffect(() => {
    const saveScroll = () => {
      if (changesTabRef.current) {
        setScrollPosition(changesTabRef.current.scrollTop)
      }
    }

    if (!isActive) {
      saveScroll()
    }
  }, [isActive])
// Restore scroll position when component becomes active
  useEffect(() => {
    if (isActive && changesTabRef.current && scrollPosition > 0) {
      setTimeout(() => {
        changesTabRef.current.scrollTop = scrollPosition
      }, 100)
    }
  }, [isActive, scrollPosition])

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
    if (!content || typeof content !== 'string') return 'plaintext'
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

  // Check if dark mode is enabled
  const isDarkMode = document.documentElement.classList.contains('dark') || 
                     document.body.classList.contains('dark') ||
                     window.matchMedia('(prefers-color-scheme: dark)').matches

  return (
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
  )
}

export default EditChangesTab