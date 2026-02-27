import { Navigate } from 'react-router-dom';

// Tags are managed within Categories page
export default function Tags() {
  return <Navigate to="/categories?tab=tags" replace />;
}
