import { motion } from 'framer-motion'
import EditTab from './tabs/EditTab'
import ErrorTab from './tabs/ErrorTab'

const MainFeature = ({ activeTab, setActiveTab }) => {
  return (
    <div className="space-y-6">
      {/* Tab Content */}
      
      {/* Edit Tab Content */}
      {activeTab === 'edit' && <EditTab />}

      {/* Error Tab Content */}
      {activeTab === 'error' && <ErrorTab />}
    </div>
  )
}

export default MainFeature