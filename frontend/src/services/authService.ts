import { apiClient } from './apiClient';
import { 
  LoginRequest, 
  LoginResponse, 
  User,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest
} from '@/types/auth';

class AuthService {
  private readonly baseUrl = '/auth';

  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      `${this.baseUrl}/login`,
      credentials
    );
    return response.data;
  }

  /**
   * Déconnexion utilisateur
   */
  async logout(): Promise<void> {
    await apiClient.post(`${this.baseUrl}/logout`);
  }

  /**
   * Rafraîchir le token
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      `${this.baseUrl}/refresh`,
      { refreshToken }
    );
    return response.data;
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(`${this.baseUrl}/me`);
    return response.data;
  }

  /**
   * Demander la réinitialisation du mot de passe
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await apiClient.post(`${this.baseUrl}/forgot-password`, data);
  }

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post(`${this.baseUrl}/reset-password`, data);
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.post(`${this.baseUrl}/change-password`, data);
  }

  /**
   * Vérifier l'email
   */
  async verifyEmail(token: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/verify-email`, { token });
  }

  /**
   * Renvoyer l'email de vérification
   */
  async resendVerificationEmail(): Promise<void> {
    await apiClient.post(`${this.baseUrl}/resend-verification`);
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(`${this.baseUrl}/profile`, data);
    return response.data;
  }

  /**
   * Uploader un avatar
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<{ avatarUrl: string }>(
      `${this.baseUrl}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Supprimer l'avatar
   */
  async deleteAvatar(): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/avatar`);
  }

  /**
   * Obtenir les sessions actives
   */
  async getActiveSessions(): Promise<any[]> {
    const response = await apiClient.get(`${this.baseUrl}/sessions`);
    return response.data;
  }

  /**
   * Révoquer une session
   */
  async revokeSession(sessionId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/sessions/${sessionId}`);
  }

  /**
   * Révoquer toutes les sessions sauf la courante
   */
  async revokeAllOtherSessions(): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/sessions/others`);
  }
}

export const authService = new AuthService();

