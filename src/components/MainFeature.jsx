import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

function MainFeature() {
  const [inputText, setInputText] = useState('')
  const [processedCode, setProcessedCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [editorSettings, setEditorSettings] = useState({
    showLineNumbers: true,
    theme: 'light',
    fontSize: 14
  })
  const [processingStats, setProcessingStats] = useState({
    lineCount: 0,
    processingTime: 0,
    codeType: 'html'
  })
  
  const codeEditorRef = useRef(null)

  // Transform input text into formatted HTML/JS code
  const transformToCode = (text) => {
    const startTime = Date.now()
    
    // Basic transformation rules
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) return { html: '', js: '', type: 'html' }
    
    // Detect if input looks like a list or structured data
    const isList = lines.every(line => line.match(/^[-*•]\s/) || line.match(/^\d+\.\s/))
    const isKeyValue = lines.some(line => line.includes(':'))
    const hasJSKeywords = text.match(/\b(function|const|let|var|if|for|while|class)\b/)
    
    if (hasJSKeywords || text.includes('{') || text.includes('(')) {
      // Transform to JavaScript
      const jsCode = `// Generated JavaScript Code
function processData() {
${lines.map(line => `  // ${line.trim()}`).join('\n')}
  
  const data = {
${lines.map((line, index) => {
  const cleanLine = line.trim().replace(/[^a-zA-Z0-9\s]/g, '')
  const key = cleanLine.split(' ')[0].toLowerCase() || `item${index + 1}`
  const value = cleanLine.split(' ').slice(1).join(' ') || 'value'
  return `    ${key}: "${value}"`
}).join(',\n')}
  };
  
  return data;
}

// Execute the function
const result = processData();
console.log(result);`
      
      return { 
        code: jsCode, 
        type: 'javascript',
        processingTime: Date.now() - startTime
      }
    } else if (isList) {
      // Transform to HTML list
      const listItems = lines.map(line => {
        const cleanLine = line.replace(/^[-*•]\s/, '').replace(/^\d+\.\s/, '')
        return `    <li>${cleanLine}</li>`
      }).join('\n')
      
      const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Content</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        ul { list-style-type: disc; padding-left: 20px; }
        li { margin: 5px 0; }
    </style>
</head>
<body>
    <h2>Generated List</h2>
    <ul>
${listItems}
    </ul>
</body>
</html>`
      
      return { 
        code: htmlCode, 
        type: 'html',
        processingTime: Date.now() - startTime
      }
    } else if (isKeyValue) {
      // Transform to HTML table
      const tableRows = lines.map(line => {
        const [key, ...valueParts] = line.split(':')
        const value = valueParts.join(':').trim()
        return `        <tr>
            <td><strong>${key.trim()}</strong></td>
            <td>${value}</td>
        </tr>`
      }).join('\n')
      
      const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Table</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
    </style>
</head>
<body>
    <h2>Generated Data Table</h2>
    <table>
        <thead>
            <tr>
                <th>Property</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
${tableRows}
        </tbody>
    </table>
</body>
</html>`
      
      return { 
        code: htmlCode, 
        type: 'html',
        processingTime: Date.now() - startTime
      }
    } else {
      // Transform to HTML paragraphs
      const paragraphs = lines.map(line => `    <p>${line.trim()}</p>`).join('\n')
      
      const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Content</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            margin: 40px; 
            color: #333; 
        }
        p { margin: 15px 0; }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    </style>
</head>
<body>
    <h1>Generated Content</h1>
${paragraphs}
</body>
</html>`
      
      return { 
        code: htmlCode, 
        type: 'html',
        processingTime: Date.now() - startTime
      }
    }
  }

  const handleProcess = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to transform')
      return
    }

    setIsProcessing(true)
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const result = transformToCode(inputText)
    setProcessedCode(result.code)
    setProcessingStats({
      lineCount: result.code.split('\n').length,
      processingTime: result.processingTime,
      codeType: result.type
    })
    
    setIsProcessing(false)
    toast.success(`Successfully transformed to ${result.type.toUpperCase()}!`)
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
      {/* Input Section */}
      <div className="glass-panel p-6 sm:p-8">
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

      {/* Code Editor */}
      <div className="glass-panel p-6 sm:p-8">
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

        <div className="neu-input p-0 overflow-hidden bg-surface-50 dark:bg-surface-800">
          {processedCode ? (
            <div className="flex min-h-96">
              {editorSettings.showLineNumbers && (
                <div className="line-numbers py-4 min-w-16 dark:bg-surface-900 dark:border-surface-700">
                  {lineNumbers.map(num => (
                    <div key={num} className="h-6 flex items-center justify-end pr-4">
                      {num}
                    </div>
                  ))}
                </div>
              )}
              <div 
                ref={codeEditorRef}
                className="flex-1 p-4 code-editor custom-scrollbar overflow-auto"
                style={{ fontSize: `${editorSettings.fontSize}px` }}
              >
                <pre className="whitespace-pre-wrap text-surface-900 dark:text-surface-100">
                  {processedCode}
                </pre>
              </div>
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
                  Enter some text above and click "Transform to Code"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default MainFeature