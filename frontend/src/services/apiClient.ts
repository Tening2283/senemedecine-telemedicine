import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import toast from 'react-hot-toast';

// Configuration de base
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

// Interface pour les erreurs API
interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: any;
}

// Créer l'instance Axios
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Intercepteur de requête
  client.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      // Ajouter le token d'authentification
      const token = localStorage.getItem('senemedecine_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Ajouter l'ID de l'hôpital si disponible
      const hospitalId = localStorage.getItem('senemedecine_hospital_id');
      if (hospitalId && config.headers) {
        config.headers['X-Hospital-Id'] = hospitalId;
      }

      // Log des requêtes en développement
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
          data: config.data,
          params: config.params,
        });
      }

      return config;
    },
    error => {
      console.error('❌ Erreur de requête:', error);
      return Promise.reject(error);
    }
  );

  // Intercepteur de réponse
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log des réponses en développement
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }

      return response;
    },
    async (error: AxiosError<ApiError>) => {
      const { response, config } = error;

      // Log des erreurs
      console.error('❌ Erreur API:', {
        url: config?.url,
        method: config?.method,
        status: response?.status,
        data: response?.data,
      });

      // Gestion des erreurs spécifiques
      if (response) {
        const { status, data } = response;

        switch (status) {
          case 401:
            // Token expiré ou invalide
            if (data?.message?.includes('token') || data?.error === 'Unauthorized') {
              // Essayer de rafraîchir le token
              const refreshToken = localStorage.getItem('senemedecine_refresh_token');
              if (refreshToken && !config?.url?.includes('/auth/refresh')) {
                try {
                  const refreshResponse = await client.post('/auth/refresh', {
                    refreshToken,
                  });

                  const { token } = refreshResponse.data;
                  localStorage.setItem('senemedecine_token', token);

                  // Retry la requête originale
                  if (config && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                    return client.request(config);
                  }
                } catch (refreshError) {
                  // Échec du rafraîchissement, rediriger vers la connexion
                  localStorage.removeItem('senemedecine_token');
                  localStorage.removeItem('senemedecine_refresh_token');
                  localStorage.removeItem('senemedecine_user');
                  window.location.href = '/login';
                  return Promise.reject(refreshError);
                }
              } else {
                // Pas de refresh token, rediriger vers la connexion
                localStorage.removeItem('senemedecine_token');
                localStorage.removeItem('senemedecine_refresh_token');
                localStorage.removeItem('senemedecine_user');
                window.location.href = '/login';
              }
            }
            break;

          case 403:
            toast.error("Accès refusé. Vous n'avez pas les permissions nécessaires.");
            break;

          case 404:
            if (!config?.url?.includes('/auth/me')) {
              toast.error('Ressource non trouvée.');
            }
            break;

          case 422:
            // Erreurs de validation
            if (data?.details) {
              const validationErrors = Object.values(data.details).flat();
              validationErrors.forEach((errorMsg: any) => {
                toast.error(errorMsg);
              });
            } else {
              toast.error(data?.message || 'Données invalides.');
            }
            break;

          case 429:
            toast.error('Trop de requêtes. Veuillez patienter avant de réessayer.');
            break;

          case 500:
            toast.error('Erreur serveur. Veuillez réessayer plus tard.');
            break;

          case 503:
            toast.error('Service temporairement indisponible.');
            break;

          default:
            if (status >= 400) {
              toast.error(data?.message || 'Une erreur est survenue.');
            }
        }
      } else if (error.code === 'ECONNABORTED') {
        toast.error("Délai d'attente dépassé. Vérifiez votre connexion.");
      } else if (error.message === 'Network Error') {
        toast.error('Erreur de réseau. Vérifiez votre connexion internet.');
      } else {
        toast.error('Une erreur inattendue est survenue.');
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Instance principale du client API
export const apiClient = createApiClient();

// Fonctions utilitaires pour les requêtes
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.get(url, config),

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.post(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.put(url, data, config),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.patch(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.delete(url, config),
};

// Fonction pour configurer l'hôpital actuel
export const setCurrentHospital = (hospitalId: string): void => {
  localStorage.setItem('senemedecine_hospital_id', hospitalId);
};

// Fonction pour obtenir l'hôpital actuel
export const getCurrentHospital = (): string | null => {
  return localStorage.getItem('senemedecine_hospital_id');
};

// Fonction pour nettoyer l'hôpital actuel
export const clearCurrentHospital = (): void => {
  localStorage.removeItem('senemedecine_hospital_id');
};

export default apiClient;
