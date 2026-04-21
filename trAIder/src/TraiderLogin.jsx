import { useNavigate } from 'react-router-dom'

// inside the component:
const navigate = useNavigate()

const handleSubmit = (e) => {
  e.preventDefault()
  setLoading(true)
  setTimeout(() => {
    setLoading(false)
    navigate('/app')   // sends user to your existing App shell
  }, 1800)
}