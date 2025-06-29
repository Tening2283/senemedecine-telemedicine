import { Request, Response } from 'express';
// TODO: Remplacer par l'insertion réelle en base de données
export const createUser = async (req: Request, res: Response) => {
  try {
    console.log('Reçu création utilisateur:', req.body);
    const user = req.body;
    res.status(201).json({ data: user });
  } catch (err) {
    console.error('Erreur backend création utilisateur:', err);
    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
  }
}; 