// Main authentication component exports
export { LoginForm } from './LoginForm'
export { SignupForm } from './SignupForm'
export { ForgotPasswordForm } from './ForgotPasswordForm'
export { AuthModal } from './AuthModal'
export { UserMenu } from './UserMenu'
export { ProtectedRoute, useRequireAuth } from './ProtectedRoute'

// Re-export auth context
export { useAuth, AuthProvider } from '@/contexts/AuthContext'

// Default export for convenience
import { AuthModal } from './AuthModal'
export default AuthModal