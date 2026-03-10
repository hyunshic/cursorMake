import Header from './Header'
import './WorkManagement.css'

const WorkManagement = () => {
  return (
    <div className="work-container">
      <Header />
      <div className="work-content">
        <div className="work-placeholder">
          <h2>작업관리</h2>
          <p>작업 관리 기능이 여기에 표시됩니다.</p>
        </div>
      </div>
    </div>
  )
}

export default WorkManagement
