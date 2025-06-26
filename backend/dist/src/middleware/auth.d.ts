import { Request, Response, NextFunction } from 'express';
import { User } from '../types';
interface AuthRequest extends Request {
    user?: User;
}
export declare const authenticateToken: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const authorizeRoles: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const authorizeHospital: (req: AuthRequest, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=auth.d.ts.map