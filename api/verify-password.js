// api/verify-password.js
//
// Endpoint minimal : reçoit un mot de passe, dit juste "oui" ou "non".
// Utilisé par l'écran de connexion de /admin avant même d'afficher le
// formulaire — évite de montrer l'interface admin à quelqu'un qui n'a
// pas le mot de passe.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { password } = req.body;

  if (password && password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ valid: true });
  }

  return res.status(401).json({ valid: false });
}
