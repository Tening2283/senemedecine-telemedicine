import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types';

interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ 
      success: false, 
      error: 'Token d\'accès requis' 
    });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, jwtSecret) as User;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ 
      success: false, 
      error: 'Token invalide' 
    });
    return;
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        error: 'Utilisateur non authentifié' 
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        error: 'Accès non autorisé' 
      });
      return;
    }

    next();
  };
};

export const authorizeHospital = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ 
      success: false, 
      error: 'Utilisateur non authentifié' 
    });
    return;
  }

  // Les admins peuvent accéder à tous les hôpitaux
  if (req.user.role === 'ADMIN') {
    next();
    return;
  }

  const hopitalId = req.params.hopitalId || req.body.hopital_id;
  
  if (req.user.hopital_id !== hopitalId) {
    res.status(403).json({ 
      success: false, 
      error: 'Accès non autorisé à cet hôpital' 
    });
    return;
  }

  next();
}; 