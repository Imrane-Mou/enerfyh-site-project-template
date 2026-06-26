// api/save-project.js
//
// Elle reçoit le JSON d'un projet depuis le formulaire admin, vérifie le mot de
// passe, va chercher le fichier projects.json actuel sur GitHub, l'arrange
// (ajout, modification ou suppression du projet), puis le renvoie à GitHub
// sous forme d'un nouveau commit.

export default async function handler(req, res) {
  // ── 1. On n'accepte que les requêtes POST ──
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // ── 2. Vérification du mot de passe ──
  // Le formulaire admin envoie le mot de passe dans le corps de la requête.
  // On le compare à la variable d'environnement stockée sur Vercel (jamais
  // visible côté navigateur).
  const { password, action, project, slug } = req.body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }

  // ── 3. Configuration GitHub ──
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = process.env.GITHUB_REPO_OWNER;   // ex: "Imrane-Mou"
  const REPO_NAME = process.env.GITHUB_REPO_NAME;     // ex: "enerfyh-site-project-template"
  const FILE_PATH = 'src/data/projects.json';
  const BRANCH = 'main';

  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    return res.status(500).json({ error: 'Configuration serveur manquante (variables d\'environnement)' });
  }

  const githubApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
  const githubHeaders = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };

  try {
    // ── 4. On récupère le fichier projects.json actuel sur GitHub ──
    // L'API GitHub renvoie le contenu encodé en base64, plus un "sha" qui
    // identifie la version actuelle du fichier (obligatoire pour pouvoir
    // le modifier sans écraser un changement concurrent).
    const getResponse = await fetch(`${githubApiUrl}?ref=${BRANCH}`, {
      headers: githubHeaders,
    });

    if (!getResponse.ok) {
      const errText = await getResponse.text();
      return res.status(500).json({ error: 'Impossible de lire projects.json sur GitHub', details: errText });
    }

    const fileData = await getResponse.json();
    const currentSha = fileData.sha;
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const projects = JSON.parse(currentContent);

    // ── 5. On modifie la liste des projets selon l'action demandée ──
    let updatedProjects;
    let commitMessage;

    if (action === 'delete') {
      // Suppression : on retire le projet dont le slug correspond
      updatedProjects = projects.filter(p => p.slug !== slug);
      commitMessage = `Suppression du projet : ${slug}`;
    } else if (action === 'update') {
      // Modification : on remplace le projet existant par la nouvelle version
      const exists = projects.some(p => p.slug === slug);
      if (!exists) {
        return res.status(404).json({ error: `Aucun projet trouvé avec le slug "${slug}"` });
      }
      updatedProjects = projects.map(p => (p.slug === slug ? project : p));
      commitMessage = `Mise à jour du projet : ${project.commune || slug}`;
    } else {
      // Création : on ajoute le nouveau projet à la liste
      const alreadyExists = projects.some(p => p.slug === project.slug);
      if (alreadyExists) {
        return res.status(409).json({ error: `Un projet avec le slug "${project.slug}" existe déjà` });
      }
      updatedProjects = [...projects, project];
      commitMessage = `Ajout du projet : ${project.commune || project.slug}`;
    }

    // ── 6. On envoie le nouveau contenu à GitHub (= un commit) ──
    const newContent = JSON.stringify(updatedProjects, null, 2);
    const newContentBase64 = Buffer.from(newContent, 'utf-8').toString('base64');

    const putResponse = await fetch(githubApiUrl, {
      method: 'PUT',
      headers: githubHeaders,
      body: JSON.stringify({
        message: commitMessage,
        content: newContentBase64,
        sha: currentSha,          // obligatoire : prouve qu'on modifie la bonne version
        branch: BRANCH,
      }),
    });

    if (!putResponse.ok) {
      const errText = await putResponse.text();
      return res.status(500).json({ error: 'Le commit GitHub a échoué', details: errText });
    }

    const putData = await putResponse.json();

    // ── 7. Tout s'est bien passé ──
    return res.status(200).json({
      success: true,
      message: commitMessage,
      commitUrl: putData.commit?.html_url || null,
    });

  } catch (err) {
    return res.status(500).json({ error: 'Erreur inattendue', details: err.message });
  }
}
