export async function translateWithDeepSeek(nom_fr, description_fr) {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error('Clé API OpenRouter manquante');
    }

    const prompt = `Traduis le nom et la description suivants en anglais, espagnol, japonais et chinois (simplifié).
Réponds exactement dans ce format JSON :

{
  "nom": {
    "en": "...",
    "es": "...",
    "ja": "...",
    "zh": "..."
  },
  "description": {
    "en": "...",
    "es": "...",
    "ja": "...",
    "zh": "..."
  }
}

Nom : ${nom_fr}
Description : ${description_fr}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Chez Alphonse Restaurant'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Réponse API invalide');
    }

    const content = data.choices[0].message.content.trim();
    
    // Nettoyer le contenu pour extraire uniquement le JSON
    let jsonContent = content;
    if (content.includes('```json')) {
      jsonContent = content.split('```json')[1].split('```')[0].trim();
    } else if (content.includes('```')) {
      jsonContent = content.split('```')[1].split('```')[0].trim();
    }

    try {
      const translations = JSON.parse(jsonContent);
      
      // Vérifier la structure attendue
      if (!translations.nom || !translations.description) {
        throw new Error('Structure JSON invalide: nom ou description manquant');
      }

      // Fonction de normalisation des clés de langues
      function normalizeKey(key) {
        if (key.toLowerCase().includes('chinois') || key.toLowerCase() === 'zh' || key.toLowerCase() === 'chinese') return 'zh';
        if (key === 'en' || key.toLowerCase() === 'english' || key.toLowerCase() === 'anglais') return 'en';
        if (key === 'es' || key.toLowerCase() === 'spanish' || key.toLowerCase() === 'espagnol') return 'es';
        if (key === 'ja' || key.toLowerCase() === 'japanese' || key.toLowerCase() === 'japonais') return 'ja';
        return null;
      }

      // Normaliser les clés et filtrer les traductions
      const filteredTranslations = { nom: {}, description: {} };

      // Debug: Afficher les clés reçues de l'API
      console.log(' Debug clés reçues de l\'API:');
      console.log('Clés nom:', Object.keys(translations.nom || {}));
      console.log('Clés description:', Object.keys(translations.description || {}));

      // Normaliser les traductions de nom
      for (const key in translations.nom) {
        const lang = normalizeKey(key);
        if (lang) {
          filteredTranslations.nom[lang] = translations.nom[key];
          console.log(` Nom mappé: ${key} → ${lang} = "${translations.nom[key]}"`);
        } else {
          console.log(`⚠️ Clé nom ignorée: ${key}`);
        }
      }

      // Normaliser les traductions de description
      for (const key in translations.description) {
        const lang = normalizeKey(key);
        if (lang) {
          filteredTranslations.description[lang] = translations.description[key];
          console.log(` Description mappée: ${key} → ${lang} = "${translations.description[key]}"`);
        } else {
          console.log(`⚠️ Clé description ignorée: ${key}`);
        }
      }

      // Debug: Vérifier les traductions finales
      console.log(' Debug traductions finales après normalisation:');
      console.log('filteredTranslations.nom.zh:', filteredTranslations.nom?.zh);
      console.log('filteredTranslations.description.zh:', filteredTranslations.description?.zh);
      console.log('Toutes les traductions nom:', filteredTranslations.nom);
      console.log('Toutes les traductions description:', filteredTranslations.description);

      // Vérifier que les langues essentielles sont présentes
      const requiredLangs = ['en', 'es', 'ja', 'zh'];
      for (const lang of requiredLangs) {
        if (!filteredTranslations.nom[lang] || !filteredTranslations.description[lang]) {
          console.error(` Traduction manquante pour la langue: ${lang}`);
          console.error(`nom[${lang}]:`, filteredTranslations.nom[lang]);
          console.error(`description[${lang}]:`, filteredTranslations.description[lang]);
          // Ne pas lancer d'erreur, continuer avec les traductions disponibles
          console.warn(`⚠️ Continuons avec les traductions disponibles`);
        }
      }

      return filteredTranslations;
      
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      console.error('Contenu reçu:', content);
      throw new Error(`Impossible de parser la réponse JSON: ${parseError.message}`);
    }

  } catch (error) {
    console.error('Erreur dans translateWithDeepSeek:', error);
    throw error;
  }
}

