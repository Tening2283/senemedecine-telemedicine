import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '@/services/authService';
import { 
  User, 
  AuthContextType, 
  LoginRequest,
  LoginResponse 
} from '@/types/auth';

// Types pour le reducer
type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: LoginResponse }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_TOKEN'; payload: string };

// État initial
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
};

// Contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Vérifier le token au chargement
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('senemedecine_token');
        if (token) {
          // Vérifier la validité du token
          const user = await authService.getCurrentUser();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user,
              token,
              refreshToken: localStorage.getItem('senemedecine_refresh_token') || '',
              expiresIn: 0,
            },
          });
        }
      } catch (error) {
        // Token invalide, nettoyer le localStorage
        localStorage.removeItem('senemedecine_token');
        localStorage.removeItem('senemedecine_refresh_token');
        localStorage.removeItem('senemedecine_user');
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Fonction de connexion
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.login(credentials);
      
      // Stocker les tokens
      localStorage.setItem('senemedecine_token', response.token);
      localStorage.setItem('senemedecine_refresh_token', response.refreshToken);
      localStorage.setItem('senemedecine_user', JSON.stringify(response.user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = (): void => {
    // Nettoyer le localStorage
    localStorage.removeItem('senemedecine_token');
    localStorage.removeItem('senemedecine_refresh_token');
    localStorage.removeItem('senemedecine_user');
    
    dispatch({ type: 'LOGOUT' });
  };

  // Fonction de rafraîchissement du token
  const refreshToken = async (): Promise<void> => {
    try {
      const refreshTokenValue = localStorage.getItem('senemedecine_refresh_token');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(refreshTokenValue);
      
      localStorage.setItem('senemedecine_token', response.token);
      localStorage.setItem('senemedecine_refresh_token', response.refreshToken);
      
      dispatch({ type: 'SET_TOKEN', payload: response.token });
    } catch (error) {
      // Échec du rafraîchissement, déconnecter l'utilisateur
      logout();
      throw error;
    }
  };

  // Fonction de mise à jour de l'utilisateur
  const updateUser = (userData: Partial<User>): void => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    
    // Mettre à jour le localStorage
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('senemedecine_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    login,
    logout,
    refreshToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

