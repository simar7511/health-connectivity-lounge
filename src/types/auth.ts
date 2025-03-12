
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAuth?: boolean;
  providerOnly?: boolean;
}
