import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Editor } from '@monaco-editor/react'
import ApperIcon from './ApperIcon'

function CodeEditor({ 
  code, 
  onChange, 
  onCopy, 
  language, 
  isDarkMode,
  className = "",
editorSettings = { showLineNumbers: false, enableFolding: true, fontSize: 14, showErrors: false },
setEditorSettings = () => {}
}) {
  const codeEditorRef = useRef(null)
  // Handle Monaco Editor mount
  const handleEditorDidMount = (editor, monaco) => {
    codeEditorRef.current = editor
    // Configure additional editor options if needed
    editor.updateOptions({
      wordWrap: 'on',
      automaticLayout: true
    })
  }

  return (
    <div className={`glass-panel p-6 sm:p-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4 sm:mb-0">
          Actual Response
</h3>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={editorSettings.showLineNumbers}
              onChange={(e) => setEditorSettings(prev => ({ ...prev, showLineNumbers: e.target.checked }))}
              className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer"
            />
            <span className="text-surface-600 dark:text-surface-300 select-none">Line Numbers</span>
          </label>
<label className="flex items-center space-x-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={editorSettings.enableFolding}
              onChange={(e) => setEditorSettings(prev => ({ ...prev, enableFolding: e.target.checked }))}
              className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer"
            />
            <span className="text-surface-600 dark:text-surface-300 select-none">Code Folding</span>
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
        {code ? (
          <div className="min-h-96">
            <Editor
              height="400px"
              language={language}
              value={code}
onChange={(value) => onChange && onChange(value || '')}
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
                validate: false,
                renderValidationDecorations: 'off'
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
  )
}

export default CodeEditor