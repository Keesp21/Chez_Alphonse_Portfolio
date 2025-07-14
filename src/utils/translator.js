const translations = {
  // Dictionnaire de traductions communes pour les plats (limité aux 5 langues autorisées)
  ingredients: {
    'saumon': { en: 'salmon', es: 'salmón', ja: 'サーモン', zh: '三文鱼' },
    'bœuf': { en: 'beef', es: 'ternera', ja: '牛肉', zh: '牛肉' },
    'poulet': { en: 'chicken', es: 'pollo', ja: '鶏肉', zh: '鸡肉' },
    'canard': { en: 'duck', es: 'pato', ja: 'アヒル', zh: '鸭肉' },
    'légumes': { en: 'vegetables', es: 'verduras', ja: '野菜', zh: '蔬菜' },
    'riz': { en: 'rice', es: 'arroz', ja: 'ご飯', zh: '米饭' },
    'sauce': { en: 'sauce', es: 'salsa', ja: 'ソース', zh: '酱汁' },
    'fromage': { en: 'cheese', es: 'queso', ja: 'チーズ', zh: '奶酪' },
    'chocolat': { en: 'chocolate', es: 'chocolate', ja: 'チョコレート', zh: '巧克力' },
    'vanille': { en: 'vanilla', es: 'vainilla', ja: 'バニラ', zh: '香草' },
    'frais': { en: 'fresh', es: 'fresco', ja: '新鮮な', zh: '新鲜' },
    'grillé': { en: 'grilled', es: 'a la parrilla', ja: 'グリル', zh: '烤' },
    'tartare': { en: 'tartare', es: 'tartar', ja: 'タルタル', zh: '鞑靼' },
    'teriyaki': { en: 'teriyaki', es: 'teriyaki', ja: '照り焼き', zh: '照烧' },
    'mochi': { en: 'mochi', es: 'mochi', ja: '餅', zh: '麻糬' },
    'tarte': { en: 'tart', es: 'tarta', ja: 'タルト', zh: '挞' },
    'mousse': { en: 'mousse', es: 'mousse', ja: 'ムース', zh: '慕斯' },
    'crumble': { en: 'crumble', es: 'crumble', ja: 'クランブル', zh: '酥粒' },
    'glacé': { en: 'ice cream', es: 'helado', ja: 'アイス', zh: '冰淇淋' },
    'laqué': { en: 'lacquered', es: 'laqueado', ja: 'ラッカー', zh: '上漆' }
  },
  
  // Traductions de base par langue (limité aux 5 langues autorisées)
  basic: {
    en: {
      'de': 'of', 'du': 'of the', 'des': 'of the', 'le': 'the', 'la': 'the', 'les': 'the',
      'et': 'and', 'avec': 'with', 'aux': 'with', 'à': 'with', 'sur': 'on'
    },
    es: {
      'de': 'de', 'du': 'del', 'des': 'de los', 'le': 'el', 'la': 'la', 'les': 'los',
      'et': 'y', 'avec': 'con', 'aux': 'con', 'à': 'con', 'sur': 'sobre'
    },
    ja: {
      'de': 'の', 'du': 'の', 'des': 'の', 'le': '', 'la': '', 'les': '',
      'et': 'と', 'avec': 'と', 'aux': 'と', 'à': 'に', 'sur': 'の上に'
    },
    zh: {
      'de': '的', 'du': '的', 'des': '的', 'le': '', 'la': '', 'les': '',
      'et': '和', 'avec': '配', 'aux': '配', 'à': '用', 'sur': '在'
    }
  }
}

// Fonction de traduction automatique simple
export function translateMenu(frenchMenu, targetLanguage) {
  if (targetLanguage === 'fr' || !frenchMenu) return frenchMenu
  
  const translateText = (text) => {
    if (!text || typeof text !== 'string') return text
    
    let translatedText = text.toLowerCase()
    
    // Remplacer les ingrédients
    Object.keys(translations.ingredients).forEach(frenchWord => {
      const translation = translations.ingredients[frenchWord][targetLanguage]
      if (translation) {
        const regex = new RegExp(`\\b${frenchWord}\\b`, 'gi')
        translatedText = translatedText.replace(regex, translation)
      }
    })
    
    // Remplacer les mots de base
    if (translations.basic[targetLanguage]) {
      Object.keys(translations.basic[targetLanguage]).forEach(frenchWord => {
        const translation = translations.basic[targetLanguage][frenchWord]
        const regex = new RegExp(`\\b${frenchWord}\\b`, 'gi')
        translatedText = translatedText.replace(regex, translation)
      })
    }
    
    // Capitaliser la première lettre
    return translatedText.charAt(0).toUpperCase() + translatedText.slice(1)
  }
  
  const translatedMenu = {}
  
  Object.keys(frenchMenu).forEach(category => {
    translatedMenu[category] = frenchMenu[category].map(item => ({
      ...item,
      name: translateText(item.name),
      description: translateText(item.description)
    }))
  })
  
  return translatedMenu
}

