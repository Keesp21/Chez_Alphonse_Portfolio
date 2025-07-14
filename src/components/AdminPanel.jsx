import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Upload, Eye, EyeOff, Camera, Image, TestTube } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { translateWithDeepSeek } from '../utils/deepseekTranslator.js'
import { useToast, ToastContainer, Spinner } from './Toast.jsx'
import { supabase } from '../lib/supabaseClient'

const adminTranslations = {
  fr: {
    title: "Administration - Chez Alphonse",
    password: "Mot de passe",
    login: "Se connecter",
    logout: "Déconnexion",
    backToSite: "Retour au site",
    addItem: "Ajouter un plat",
    name: "Nom",
    description: "Description",
    price: "Prix",
    category: "Catégorie",
    entrees: "Entrées",
    plats: "Plats",
    desserts: "Desserts",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Sauvegarder",
    cancel: "Annuler",
    itemAdded: "Plat ajouté avec succès",
    itemUpdated: "Plat mis à jour avec succès",
    itemDeleted: "Plat supprimé avec succès",
    selectImage: "Sélectionner une image",
    language: "Langue",
    uploadImage: "Télécharger une image",
    availableLanguages: "Langues disponibles",
    testTranslation: "Tester la traduction",
    translationPreview: "Aperçu des traductions",
    manualCorrection: "Correction manuelle (optionnel)",
    translating: "Traduction en cours...",
    addingItem: "Ajout en cours..."
  },
  en: {
    title: "Administration - Chez Alphonse",
    password: "Password",
    login: "Login",
    logout: "Logout",
    backToSite: "Back to site",
    addItem: "Add dish",
    name: "Name",
    description: "Description",
    price: "Price",
    category: "Category",
    entrees: "Starters",
    plats: "Main Courses",
    desserts: "Desserts",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    itemAdded: "Dish added successfully",
    itemUpdated: "Dish updated successfully",
    itemDeleted: "Dish deleted successfully",
    selectImage: "Select image",
    language: "Language",
    uploadImage: "Upload image",
    availableLanguages: "Available languages",
    testTranslation: "Test translation",
    translationPreview: "Translation preview",
    manualCorrection: "Manual correction (optional)",
    translating: "Translating...",
    addingItem: "Adding item..."
  }
}

const initialMenuData = {
  fr: {
    entrees: [
      { id: 1, name: "Tartare de saumon", description: "Saumon frais, avocat, citron vert", price: "18€" },
      { id: 2, name: "Foie gras poêlé", description: "Figues confites, pain d'épices", price: "24€" },
      { id: 3, name: "Burrata crémeuse", description: "Tomates cerises, basilic, huile d'olive", price: "16€" }
    ],
    plats: [
      { id: 4, name: "Bœuf de Kobe", description: "Légumes de saison, jus de viande", price: "45€" },
      { id: 5, name: "Saumon teriyaki", description: "Riz japonais, légumes croquants", price: "28€" },
      { id: 6, name: "Canard laqué", description: "Sauce hoisin, pancakes, concombre", price: "32€" }
    ],
    desserts: [
      { id: 7, name: "Mochi glacé", description: "Vanille, thé matcha, fruits rouges", price: "12€" },
      { id: 8, name: "Tarte tatin", description: "Glace vanille bourbon", price: "14€" },
      { id: 9, name: "Chocolat noir", description: "Mousse légère, crumble cacao", price: "13€" }
    ]
  },
  en: {
    entrees: [
      { id: 1, name: "Salmon tartare", description: "Fresh salmon, avocado, lime", price: "18€" },
      { id: 2, name: "Pan-seared foie gras", description: "Candied figs, gingerbread", price: "24€" },
      { id: 3, name: "Creamy burrata", description: "Cherry tomatoes, basil, olive oil", price: "16€" }
    ],
    plats: [
      { id: 4, name: "Kobe beef", description: "Seasonal vegetables, meat jus", price: "45€" },
      { id: 5, name: "Teriyaki salmon", description: "Japanese rice, crispy vegetables", price: "28€" },
      { id: 6, name: "Lacquered duck", description: "Hoisin sauce, pancakes, cucumber", price: "32€" }
    ],
    desserts: [
      { id: 7, name: "Ice mochi", description: "Vanilla, matcha tea, red fruits", price: "12€" },
      { id: 8, name: "Tarte tatin", description: "Bourbon vanilla ice cream", price: "14€" },
      { id: 9, name: "Dark chocolate", description: "Light mousse, cocoa crumble", price: "13€" }
    ]
  },
  es: {
    entrees: [
      { id: 1, name: "Tartar de salmón", description: "Salmón fresco, aguacate, lima", price: "18€" },
      { id: 2, name: "Foie gras salteado", description: "Higos confitados, pan de especias", price: "24€" },
      { id: 3, name: "Burrata cremosa", description: "Tomates cherry, albahaca, aceite de oliva", price: "16€" }
    ],
    plats: [
      { id: 4, name: "Ternera de Kobe", description: "Verduras de temporada, jugo de carne", price: "45€" },
      { id: 5, name: "Salmón teriyaki", description: "Arroz japonés, verduras crujientes", price: "28€" },
      { id: 6, name: "Pato laqueado", description: "Salsa hoisin, tortitas, pepino", price: "32€" }
    ],
    desserts: [
      { id: 7, name: "Mochi helado", description: "Vainilla, té matcha, frutos rojos", price: "12€" },
      { id: 8, name: "Tarta tatin", description: "Helado de vainilla bourbon", price: "14€" },
      { id: 9, name: "Chocolate negro", description: "Mousse ligera, crumble de cacao", price: "13€" }
    ]
  },
  ja: {
    entrees: [
      { id: 1, name: "サーモンタルタル", description: "新鮮なサーモン、アボカド、ライム", price: "18€" },
      { id: 2, name: "フォアグラのソテー", description: "いちじくのコンフィ、ジンジャーブレッド", price: "24€" },
      { id: 3, name: "クリーミーブラータ", description: "チェリートマト、バジル、オリーブオイル", price: "16€" }
    ],
    plats: [
      { id: 4, name: "神戸牛", description: "季節の野菜、肉汁", price: "45€" },
      { id: 5, name: "照り焼きサーモン", description: "日本米、クリスピー野菜", price: "28€" },
      { id: 6, name: "北京ダック", description: "ホイシンソース、パンケーキ、きゅうり", price: "32€" }
    ],
    desserts: [
      { id: 7, name: "アイス餅", description: "バニラ、抹茶、赤い果実", price: "12€" },
      { id: 8, name: "タルトタタン", description: "バーボンバニラアイス", price: "14€" },
      { id: 9, name: "ダークチョコレート", description: "軽いムース、ココアクランブル", price: "13€" }
    ]
  }
}

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [language, setLanguage] = useState('fr')
  const [menuData, setMenuData] = useState(initialMenuData)
  const [editingItem, setEditingItem] = useState(null)
  const [newItem, setNewItem] = useState({ name: '', description: '', price: 0, category: 'Plat' })
  const [message, setMessage] = useState('')
  const [availableLanguages, setAvailableLanguages] = useState(['fr', 'en', 'es', 'ja', 'zh'])
  
  // Nouveaux états pour la traduction
  const [previewTranslation, setPreviewTranslation] = useState(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [lastTranslatedText, setLastTranslatedText] = useState('')
  const [manualTranslations, setManualTranslations] = useState({})
  const [translationsCache, setTranslationsCache] = useState({}) // Cache des traductions par plat
  
  const { toasts, toast, removeToast } = useToast()

  const t = adminTranslations[language]

  const handleLogin = () => {
    if (password === 'Camelia16') {
      setIsAuthenticated(true)
      sessionStorage.setItem('chezAlphonseAuth', 'true')
      setPassword('')
    } else {
      alert('Mot de passe incorrect')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('chezAlphonseAuth')
    setPassword('')
  }

  // Load data from Supabase and session storage
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('chezAlphonseAuth')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }

    // Load menu data from Supabase
    const loadMenuFromSupabase = async () => {
      try {
        console.log("Chargement des données depuis Supabase (Admin)...");
        const { data, error } = await supabase
          .from("menu")
          .select("id, categorie, prix, nom_fr, nom_en, nom_es, nom_ja, nom_zh, description_fr, description_en, description_es, description_ja, description_zh, created_at")
          .order("created_at", { ascending: true });

        console.log("Données Admin reçues de Supabase :", data);
        console.log("Erreur Admin Supabase :", error);

        if (!error && data) {
          // Transform Supabase data to match our menu structure
          const transformedData = transformSupabaseData(data);
          setMenuData(transformedData);
        } else if (error) {
          console.error('Error fetching menu from Supabase:', error);
          // Fallback to localStorage
          const savedMenu = localStorage.getItem('chezAlphonseMenu');
          if (savedMenu) {
            try {
              setMenuData(JSON.parse(savedMenu));
            } catch (parseError) {
              console.error('Error loading menu data:', parseError);
            }
          }
        }
      } catch (error) {
        console.error('Error connecting to Supabase:', error);
        // Fallback to localStorage
        const savedMenu = localStorage.getItem('chezAlphonseMenu');
        if (savedMenu) {
          try {
            setMenuData(JSON.parse(savedMenu));
          } catch (parseError) {
            console.error('Error loading menu data:', parseError);
          }
        }
      }
    };

    loadMenuFromSupabase();
  }, [])

  // Transform Supabase data to our menu structure
  const transformSupabaseData = (data) => {
    const menuStructure = {
      fr: { entrees: [], plats: [], desserts: [] },
      en: { entrees: [], plats: [], desserts: [] },
      es: { entrees: [], plats: [], desserts: [] },
      ja: { entrees: [], plats: [], desserts: [] },
      zh: { entrees: [], plats: [], desserts: [] }
    };

    data.forEach(item => {
      // Mapper les catégories Supabase vers les clés de structure
      let categoryKey;
      if (item.categorie === 'Entrée') {
        categoryKey = 'entrees';
      } else if (item.categorie === 'Plat') {
        categoryKey = 'plats';
      } else if (item.categorie === 'Dessert') {
        categoryKey = 'desserts';
      } else {
        categoryKey = 'plats'; // valeur par défaut
      }

      // Ajout des données avec les bons champs
      menuStructure.fr[categoryKey].push({
        id: item.id,
        name: item.nom_fr,
        description: item.description_fr,
        price: item.prix
      });

      menuStructure.en[categoryKey].push({
        id: item.id,
        name: item.nom_en,
        description: item.description_en,
        price: item.prix
      });

      menuStructure.es[categoryKey].push({
        id: item.id,
        name: item.nom_es,
        description: item.description_es,
        price: item.prix
      });

      menuStructure.ja[categoryKey].push({
        id: item.id,
        name: item.nom_ja,
        description: item.description_ja,
        price: item.prix
      });

      menuStructure.zh[categoryKey].push({
        id: item.id,
        name: item.nom_zh,
        description: item.description_zh,
        price: item.prix
      });
    });

    return menuStructure;
  };

  const getNextId = () => {
    let maxId = 0
    Object.values(menuData).forEach(langMenu => {
      Object.values(langMenu).forEach(category => {
        category.forEach(item => {
          if (item.id > maxId) maxId = item.id
        })
      })
    })
    return maxId + 1
  }

  // Fonction pour tester la traduction
  const testTranslation = async () => {
    if (!newItem.name || !newItem.description) {
      toast.error("Veuillez remplir le nom et la description avant de tester la traduction")
      return
    }

    // Créer une clé unique pour ce plat
    const cacheKey = `${newItem.name}|${newItem.description}`;
    
    // Vérifier si la traduction existe déjà dans le cache
    if (translationsCache[cacheKey]) {
      setPreviewTranslation(translationsCache[cacheKey])
      setLastTranslatedText(cacheKey)
      setManualTranslations({}) // Reset manual corrections
      toast.info("Traduction récupérée du cache ")
      return
    }

    // Vérifier si le texte a déjà été traduit (anti-doublon)
    if (cacheKey === lastTranslatedText && previewTranslation) {
      toast.info("Cette traduction a déjà été générée")
      return
    }

    setIsTranslating(true)

    try {
      const translations = await translateWithDeepSeek(newItem.name, newItem.description)
      
      // Debug: Vérifier les traductions reçues
      console.log(' Debug AdminPanel - Traductions reçues:');
      console.log('translations:', translations);
      console.log('translations.nom.zh:', translations?.nom?.zh);
      console.log('translations.description.zh:', translations?.description?.zh);
      
      // Sauvegarder dans le cache
      setTranslationsCache(prev => ({
        ...prev,
        [cacheKey]: translations
      }))
      
      setPreviewTranslation(translations)
      setLastTranslatedText(cacheKey)
      setManualTranslations({}) // Reset manual corrections
      toast.success("Traduction générée avec succès ")
    } catch (error) {
      console.error('Erreur de traduction:', error)
      toast.error(`Erreur pendant la traduction IA: ${error.message}`)
    } finally {
      setIsTranslating(false)
    }
  }

  // Fonction pour mettre à jour les corrections manuelles
  const handleManualTranslationChange = (field, value) => {
    setManualTranslations(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addItem = async () => {
    if (!newItem.name || !newItem.description || !newItem.price) {
      toast.error("Veuillez remplir tous les champs")
      return
    }

    setIsAddingItem(true)

    try {
      let translations = previewTranslation
      const cacheKey = `${newItem.name}|${newItem.description}`;

      // Si pas de traduction en preview, vérifier le cache puis générer si nécessaire
      if (!translations) {
        // Vérifier le cache d'abord
        if (translationsCache[cacheKey]) {
          translations = translationsCache[cacheKey]
        } else {
          // Générer une nouvelle traduction et la mettre en cache
          translations = await translateWithDeepSeek(newItem.name, newItem.description)
          if (translations) {
            setTranslationsCache(prev => ({
              ...prev,
              [cacheKey]: translations
            }))
          } else {
            toast.error("Erreur lors de la traduction. Le plat sera ajouté uniquement en français.")
          }
        }
      }

      // Utiliser les corrections manuelles si elles existent, sinon les traductions automatiques
      const finalNomTranslations = {
        nom_en: manualTranslations.nom_en || translations?.nom?.en || newItem.name,
        nom_es: manualTranslations.nom_es || translations?.nom?.es || newItem.name,
        nom_ja: manualTranslations.nom_ja || translations?.nom?.ja || newItem.name,
        nom_zh: manualTranslations.nom_zh || translations?.nom?.zh || newItem.name
      }

      const finalDescriptionTranslations = {
        description_en: manualTranslations.description_en || translations?.description?.en || newItem.description,
        description_es: manualTranslations.description_es || translations?.description?.es || newItem.description,
        description_ja: manualTranslations.description_ja || translations?.description?.ja || newItem.description,
        description_zh: manualTranslations.description_zh || translations?.description?.zh || newItem.description
      }

      // Debug: Vérifier les traductions finales
      console.log(' Debug AdminPanel - Traductions finales:');
      console.log('finalNomTranslations.nom_zh:', finalNomTranslations.nom_zh);
      console.log('finalDescriptionTranslations.description_zh:', finalDescriptionTranslations.description_zh);

      // Préparer les données pour Supabase
      const supabaseItem = {
        nom_fr: newItem.name,
        description_fr: newItem.description,
        prix: newItem.price,
        categorie:
          newItem.category === "Entrée" ||
          newItem.category === "Plat" ||
          newItem.category === "Dessert"
            ? newItem.category
            : "Plat",
        ...finalNomTranslations,
        ...finalDescriptionTranslations,
        created_at: new Date().toISOString()
      }

      // Debug: Vérifier les données avant insertion Supabase
      console.log(' Debug AdminPanel - supabaseItem:');
      console.log('supabaseItem.nom_zh:', supabaseItem.nom_zh);
      console.log('supabaseItem.description_zh:', supabaseItem.description_zh);
      console.log('supabaseItem complet:', supabaseItem);

      // Insérer dans Supabase
      const { data, error } = await supabase
        .from('menu')
        .insert([supabaseItem])
        .select()

      if (error) {
        console.error('Erreur Supabase:', error)
        toast.error("Erreur lors de l'ajout dans la base de données")
        return
      }

      // Réinitialiser le formulaire
      setNewItem({ name: '', description: '', price: 0, category: 'Plat' })
      setPreviewTranslation(null)
      setLastTranslatedText('')
      setManualTranslations({})
      
      toast.success(t.itemAdded)
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error)
      toast.error("Erreur lors de l'ajout du plat")
    } finally {
      setIsAddingItem(false)
    }
  }

  const deleteItem = async (id, category) => {
    try {
      const { error } = await supabase
        .from('menu')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erreur Supabase:', error)
        toast.error("Erreur lors de la suppression")
        return
      }

      toast.success(t.itemDeleted)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error("Erreur lors de la suppression du plat")
    }
  }

  const updateItem = async (updatedItem) => {
    try {
      let translations = null
      
      // Si le nom ou la description ont changé, on retraduit
      const { data: originalData, error: fetchError } = await supabase
        .from('menu')
        .select('nom_fr, description_fr')
        .eq('id', updatedItem.id)
        .single()
      
      if (fetchError) {
        console.error('Erreur lors de la récupération:', fetchError)
        toast.error("Erreur lors de la récupération des données")
        return
      }
      
      if (originalData && (originalData.nom_fr !== updatedItem.name || originalData.description_fr !== updatedItem.description)) {
        const cacheKey = `${updatedItem.name}|${updatedItem.description}`;
        
        // Vérifier le cache d'abord
        if (translationsCache[cacheKey]) {
          translations = translationsCache[cacheKey]
        } else {
          // Générer une nouvelle traduction et la mettre en cache
          try {
            translations = await translateWithDeepSeek(updatedItem.name, updatedItem.description)
            if (translations) {
              setTranslationsCache(prev => ({
                ...prev,
                [cacheKey]: translations
              }))
            }
          } catch (error) {
            console.error('Erreur de traduction lors de la mise à jour:', error)
            toast.error("Erreur lors de la traduction. L'élément sera mis à jour uniquement en français.")
          }
        }
      }

      // Préparer les données de mise à jour
      const updateData = {
        nom_fr: updatedItem.name,
        description_fr: updatedItem.description,
        prix: updatedItem.price
      }

      // Ajouter les traductions si disponibles
      if (translations) {
        updateData.nom_en = translations.nom.en
        updateData.nom_es = translations.nom.es
        updateData.nom_ja = translations.nom.ja
        updateData.nom_zh = translations.nom.zh
        updateData.description_en = translations.description.en
        updateData.description_es = translations.description.es
        updateData.description_ja = translations.description.ja
        updateData.description_zh = translations.description.zh
      }

      // Mettre à jour dans Supabase
      const { error } = await supabase
        .from('menu')
        .update(updateData)
        .eq('id', updatedItem.id)

      if (error) {
        console.error('Erreur Supabase:', error)
        toast.error("Erreur lors de la mise à jour")
        return
      }

      setEditingItem(null)
      toast.success(t.itemUpdated)
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      toast.error("Erreur lors de la mise à jour du plat")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center p-4">
        <div className="restaurant-card w-full max-w-md">
          <h1 className="section-title text-center mb-8">{t.title}</h1>
          <div className="space-y-4">
            <div className="relative">
              <Input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button onClick={handleLogin} className="w-full">
              {t.login}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base p-4">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <h1 className="section-title">{t.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4">
            <select 
              id="admin-language-selector"
              name="language"
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="fr"> Français</option>
              <option value="en"> English</option>
            </select>
            
            <Button 
              onClick={() => window.location.href = '/#/'}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backToSite}
            </Button>
            
            <Button onClick={handleLogout} variant="outline">
              {t.logout}
            </Button>
          </div>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {/* Add New Item */}
        <div className="restaurant-card mb-8">
          <h2 className="text-2xl font-bold mb-6 text-primary">{t.addItem}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              id="new-item-name"
              name="name"
              placeholder={t.name}
              value={newItem.name}
              onChange={(e) => {
                setNewItem({...newItem, name: e.target.value})
                // Reset preview if name changes
                const currentText = `${e.target.value}|${newItem.description}`
                if (currentText !== lastTranslatedText) {
                  setPreviewTranslation(null)
                }
              }}
              autoComplete="off"
            />
            <Input
              id="new-item-description"
              name="description"
              placeholder={t.description}
              value={newItem.description}
              onChange={(e) => {
                setNewItem({...newItem, description: e.target.value})
                // Reset preview if description changes
                const currentText = `${newItem.name}|${e.target.value}`
                if (currentText !== lastTranslatedText) {
                  setPreviewTranslation(null)
                }
              }}
              autoComplete="off"
            />
            <Input
              id="new-item-price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder={t.price}
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
              autoComplete="off"
            />
            <select 
              id="new-item-category"
              name="category"
              value={newItem.category} 
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="Entrée">{t.entrees}</option>
              <option value="Plat">{t.plats}</option>
              <option value="Dessert">{t.desserts}</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button 
              onClick={testTranslation}
              disabled={isTranslating || !newItem.name.trim() || !newItem.description.trim()}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isTranslating ? (
                <>
                  <Spinner size="sm" />
                  {t.translating}
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4" />
                  {t.testTranslation}
                </>
              )}
            </Button>
            
            <Button 
              onClick={addItem}
              disabled={isAddingItem || !newItem.name || !newItem.description || !newItem.price}
              className="flex items-center gap-2"
            >
              {isAddingItem ? (
                <>
                  <Spinner size="sm" />
                  {t.addingItem}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {t.addItem}
                </>
              )}
            </Button>
          </div>

          {/* Affichage des traductions preview */}
          {previewTranslation && (
            <div className="restaurant-card mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gold">{t.translationPreview}</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Nom du plat :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(previewTranslation.nom).map(([lang, translation]) => (
                      <div key={`nom-${lang}`} className="space-y-1">
                        <label className="text-sm font-medium text-gray-600">
                          {lang.toUpperCase()}:
                        </label>
                        <textarea
                          id={`manual-nom-${lang}`}
                          name={`nom_${lang}`}
                          value={manualTranslations[`nom_${lang}`] || translation}
                          onChange={(e) => handleManualTranslationChange(`nom_${lang}`, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                          rows="2"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(previewTranslation.description).map(([lang, translation]) => (
                      <div key={`desc-${lang}`} className="space-y-1">
                        <label className="text-sm font-medium text-gray-600">
                          {lang.toUpperCase()}:
                        </label>
                        <textarea
                          id={`manual-desc-${lang}`}
                          name={`description_${lang}`}
                          value={manualTranslations[`description_${lang}`] || translation}
                          onChange={(e) => handleManualTranslationChange(`description_${lang}`, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                          rows="3"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Item Modal */}
        {editingItem && (
          <div className="restaurant-card mb-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">Modifier le plat</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Input
                id={`edit-item-name-${editingItem.id}`}
                name="edit-name"
                placeholder={t.name}
                value={editingItem.name}
                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                autoComplete="off"
              />
              <Input
                id={`edit-item-description-${editingItem.id}`}
                name="edit-description"
                placeholder={t.description}
                value={editingItem.description}
                onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                autoComplete="off"
              />
              <Input
                id={`edit-item-price-${editingItem.id}`}
                name="edit-price"
                type="number"
                step="0.01"
                min="0"
                placeholder={t.price}
                value={editingItem.price}
                onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value) || 0})}
                autoComplete="off"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => updateItem(editingItem)}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {t.save}
                </Button>
                <Button 
                  onClick={() => setEditingItem(null)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  {t.cancel}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Management */}
        <div className="space-y-8">
          {[
            { key: 'entrees', value: 'Entrée' },
            { key: 'plats', value: 'Plat' },
            { key: 'desserts', value: 'Dessert' }
          ].map(({ key, value }) => (
            <div key={key} className="restaurant-card">
              <h2 className="text-2xl font-bold mb-6 text-primary capitalize">
                {t[key]}
              </h2>
              <div className="space-y-4">
                {menuData[language][key].map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                      <p className="text-primary font-bold">{item.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingItem(item)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteItem(item.id, key)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel

