import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/connection';
import { LoginRequest, LoginResponse, ApiResponse } from '../types';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, hopital_id }: LoginRequest = req.body;

    // Validation des données
    if (!email || !password || !hopital_id) {
      res.status(400).json({
        success: false,
        error: 'Email, mot de passe et ID hôpital requis'
      });
      return;
    }

    // Vérifier que l'hôpital existe
    const hopital = await db('hopitaux')
      .where({ id: hopital_id, actif: true })
      .first();

    if (!hopital) {
      res.status(404).json({
        success: false,
        error: 'Hôpital non trouvé ou inactif'
      });
      return;
    }

    // Trouver l'utilisateur
    const user = await db('users')
      .where({ email, hopital_id })
      .first();

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
      return;
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
      return;
    }

    // Créer le token JWT
    const jwtSecret = process.env.JWT_SECRET || 'default-secret';
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        hopital_id: user.hopital_id
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Retirer le hash du mot de passe de la réponse
    const { password_hash, ...userWithoutPassword } = user;

    const response: ApiResponse<LoginResponse> = {
      success: true,
      data: {
        user: userWithoutPassword,
        hopital,
        token
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const user = await db('users')
      .where({ id: userId })
      .first();

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
      return;
    }

    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
}; 