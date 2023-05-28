import { useState } from 'react';

export default function useRole() {
  const getRole = () => {
    const roleString = localStorage.getItem('role');
    const userRole = JSON.parse(roleString);
    return userRole?.role;
  };

  const [role, setRole] = useState(getRole());

  const saveRole = userRole => {
    localStorage.setItem('role', JSON.stringify(userRole.role));
    setRole(userRole.role);
  };

  return {
    setRole: saveRole,
    role
  };
}
