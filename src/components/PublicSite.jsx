import { useState, useEffect } from 'react'
import { Moon, Sun, MapPin, Clock, Instagram, QrCode, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import QRCodeGenerator from './QRCodeGenerator'
import ReviewSection from './ReviewSection'
import logoImage from '../assets/images/logo-chez-alphonse.png'
import { translateMenu } from '../utils/translator'
import { supabase } from '../lib/supabaseClient'
import { useToast, ToastContainer } from './Toast'

// Sample menu data - this would normally come from a database
const initialMenuData = {
  fr: {
    entrees: [
      { id: 1, name: "Tartare de saumon", description: "Saumon frais, avocat, citron vert", price: "18€" },
      { id: 2, name: "Foie gras poêlé", description: "Figues confites, pain d'épices", price: "24€" },
      { id: 3, name: "Burrata crémeuse", description: "Tomates cerises, basilic, huile d'olive", price: "16€" }
    ],
    plats: [
      { id: 4, name: "Bœuf de Kobé", description: "Légumes de saison, jus de viande", price: "45€" },
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
      { id: 7, name: "Ice mochi", description: "Vanilla, matcha tea, red berries", price: "12€" },
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
      { id: 5, name: "照り焼きサーモン", description: "日本米、シャキシャキ野菜", price: "28€" },
      { id: 6, name: "北京ダック", description: "海鮮醤、パンケーキ、きゅうり", price: "32€" }
    ],
    desserts: [
      { id: 7, name: "アイス餅", description: "バニラ、抹茶、赤い果実", price: "12€" },
      { id: 8, name: "タルトタタン", description: "バーボンバニラアイス", price: "14€" },
      { id: 9, name: "ダークチョコレート", description: "軽いムース、ココアクランブル", price: "13€" }
    ]
  }
}

const translations = {
  fr: {
    title: "Chez Alphonse",
    subtitle: "Restaurant Parisien",
    hero: "Bienvenue chez Alphonse",
    heroDesc: "Chez Alphonse propose une cuisine de qualité avec une combinaison de saveurs modernes et de plats traditionnels français, le choix idéal pour ceux qui cherchent un repas authentique et une atmosphère accueillante.",
    menu: "Notre Carte",
    about: "Notre Histoire",
    aboutDesc: "Créé après le Covid, Chez Alphonse est né de la passion de créer un lieu convivial où la tradition culinaire française est mise à l'honneur. Notre équipe jeune et dynamique vous accueille dans une ambiance chaleureuse, avec un engagement fort pour les produits frais et de saison.",
    info: "Infos Pratiques",
    hours: "Horaires",
    hoursText: "Lun-Ven\n08h00 - 00h00\nSam-Dim\n09h00 - 00h00\nCuisine: 12h00 - 23h00",
    address: "Adresse",
    addressText: "16 RUE ALPHONSE DAUDET\n75014 PARIS",
    contact: "Contact",
    contactText: "01 56 08 06 19",
    qrCode: "QR Code",
    qrDesc: "Scannez pour accéder au menu",
    darkMode: "Mode sombre",
    language: "Langue",
    entrees: "Entrées",
    plats: "Plats",
    desserts: "Desserts",
    admin: "Administration"
  },
  en: {
    title: "Chez Alphonse",
    subtitle: "Parisian Restaurant",
    hero: "Welcome to Alphonse",
    heroDesc: "Chez Alphonse offers quality cuisine with a combination of modern flavors and traditional French dishes, the ideal choice for those seeking an authentic meal and a welcoming atmosphere.",
    menu: "Our Menu",
    about: "Our Story",
    aboutDesc: "Created after Covid, Chez Alphonse was born from the passion to create a friendly place where French culinary tradition is honored. Our young and dynamic team welcomes you in a warm atmosphere, with a strong commitment to fresh and seasonal products.",
    info: "Practical Info",
    hours: "Hours",
    hoursText: "Mon-Fri\n8:00 AM - 12:00 AM\nSat-Sun\n9:00 AM - 12:00 AM\nKitchen: 12:00 PM - 11:00 PM",
    address: "Address",
    addressText: "16 RUE ALPHONSE DAUDET\n75014 PARIS",
    contact: "Contact",
    contactText: "01 56 08 06 19",
    qrCode: "QR Code",
    qrDesc: "Scan to access the menu",
    darkMode: "Dark mode",
    language: "Language",
    entrees: "Starters",
    plats: "Main Courses",
    desserts: "Desserts",
    admin: "Administration"
  },
  es: {
    title: "Chez Alphonse",
    subtitle: "Restaurante Parisino",
    hero: "Bienvenidos a Alphonse",
    heroDesc: "Chez Alphonse ofrece cocina de calidad con una combinación de sabores modernos y platos tradicionales franceses, la elección ideal para quienes buscan una comida auténtica y un ambiente acogedor.",
    menu: "Nuestra Carta",
    about: "Nuestra Historia",
    aboutDesc: "Creado después del Covid, Chez Alphonse nació de la pasión por crear un lugar acogedor donde se honra la tradición culinaria francesa. Nuestro equipo joven y dinámico te recibe en un ambiente cálido, con un fuerte compromiso con productos frescos y de temporada.",
    info: "Información Práctica",
    hours: "Horarios",
    hoursText: "Lun-Vie\n08:00 - 00:00\nSáb-Dom\n09:00 - 00:00\nCocina: 12:00 - 23:00",
    address: "Dirección",
    addressText: "16 RUE ALPHONSE DAUDET\n75014 PARÍS",
    contact: "Contacto",
    contactText: "01 56 08 06 19",
    qrCode: "Código QR",
    qrDesc: "Escanea para acceder al menú",
    darkMode: "Modo oscuro",
    language: "Idioma",
    entrees: "Entrantes",
    plats: "Platos Principales",
    desserts: "Postres",
    admin: "Administración"
  },
  ja: {
    title: "シェ・アルフォンス",
    subtitle: "パリのレストラン",
    hero: "アルフォンスへようこそ",
    heroDesc: "シェ・アルフォンスは、モダンな風味と伝統的なフランス料理を組み合わせた質の高い料理を提供し、本格的な食事と温かい雰囲気を求める方に最適な選択です。",
    menu: "メニュー",
    about: "私たちの物語",
    aboutDesc: "コロナ後に誕生したシェ・アルフォンスは、フランスの料理伝統を大切にする親しみやすい場所を作りたいという情熱から生まれました。若くダイナミックなチームが温かい雰囲気でお迎えし、新鮮で季節の食材への強いコミットメントを持っています。",
    info: "実用的な情報",
    hours: "営業時間",
    hoursText: "月-金\n08:00 - 00:00\n土-日\n09:00 - 00:00\nキッチン: 12:00 - 23:00",
    address: "住所",
    addressText: "16 RUE ALPHONSE DAUDET\n75014 パリ",
    contact: "連絡先",
    contactText: "01 56 08 06 19",
    qrCode: "QRコード",
    qrDesc: "スキャンしてメニューにアクセス",
    darkMode: "ダークモード",
    language: "言語",
    entrees: "前菜",
    plats: "メインコース",
    desserts: "デザート",
    admin: "管理"
  },
  de: {
    title: "Chez Alphonse",
    subtitle: "Pariser Restaurant",
    hero: "Willkommen bei Alphonse",
    heroDesc: "Entdecken Sie unsere traditionelle französische Küche mit japanischen Einflüssen in einem warmen und eleganten Ambiente.",
    menu: "Unsere Karte",
    about: "Unsere Geschichte",
    aboutDesc: "Nach Covid entstanden, wurde Chez Alphonse aus der Leidenschaft geboren, einen freundlichen Ort zu schaffen, an dem sich französische Tradition und asiatische Einflüsse vermischen. Unser junges und dynamisches Team empfängt Sie in einer warmen Atmosphäre mit einem starken Engagement für frische, saisonale Produkte und Zero Waste.",
    info: "Praktische Informationen",
    hours: "Öffnungszeiten",
    hoursText: "Mo-Fr\n08:00 - 00:00\nSa-So\n09:00 - 00:00\nKüche: 12:00 - 23:00",
    address: "Adresse",
    addressText: "16 RUE ALPHONSE DAUDET\n75014 PARIS",
    contact: "Kontakt",
    contactText: "01 56 08 06 19",
    qrCode: "QR-Code",
    qrDesc: "Scannen Sie für Zugang zum Menü",
    darkMode: "Dunkler Modus",
    language: "Sprache",
    entrees: "Vorspeisen",
    plats: "Hauptgerichte",
    desserts: "Desserts",
    admin: "Verwaltung"
  },
  it: {
    title: "Chez Alphonse",
    subtitle: "Ristorante Parigino",
    hero: "Benvenuti da Alphonse",
    heroDesc: "Scoprite la nostra cucina francese tradizionale con tocchi di ispirazione giapponese in un ambiente caldo ed elegante.",
    menu: "La Nostra Carta",
    about: "La Nostra Storia",
    aboutDesc: "Creato dopo il Covid, Chez Alphonse è nato dalla passione di creare un luogo accogliente dove si mescolano tradizione francese e influenze asiatiche. Il nostro team giovane e dinamico vi accoglie in un'atmosfera calorosa, con un forte impegno per prodotti freschi, di stagione e zero sprechi.",
    info: "Informazioni Pratiche",
    hours: "Orari",
    hoursText: "Lun-Ven\n08:00 - 00:00\nSab-Dom\n09:00 - 00:00\nCucina: 12:00 - 23:00",
    address: "Indirizzo",
    addressText: "16 RUE ALPHONSE DAUDET\n75014 PARIGI",
    contact: "Contatto",
    contactText: "01 56 08 06 19",
    qrCode: "Codice QR",
    qrDesc: "Scansiona per accedere al menu",
    darkMode: "Modalità scura",
    language: "Lingua",
    entrees: "Antipasti",
    plats: "Piatti Principali",
    desserts: "Dolci",
    admin: "Amministrazione"
  },
  pt: {
    title: "Chez Alphonse",
    subtitle: "Restaurante Parisiense",
    hero: "Bem-vindos ao Alphonse",
    heroDesc: "Descubra nossa cozinha francesa tradicional com toques de inspiração japonesa em um ambiente acolhedor e elegante.",
    menu: "Nossa Carta",
    about: "Nossa História",
    aboutDesc: "Criado após a Covid, Chez Alphonse nasceu da paixão de criar um lugar acolhedor onde se misturam tradição francesa e influências asiáticas. Nossa equipe jovem e dinâmica os recebe em uma atmosfera calorosa, com um forte compromisso com produtos frescos, sazonais e desperdício zero.",
    info: "Informações Práticas",
    hours: "Horários",
    hoursText: "Seg-Sex\n08:00 - 00:00\nSáb-Dom\n09:00 - 00:00\nCozinha: 12:00 - 23:00",
    address: "Endereço",
    addressText: "16 RUE ALPHONSE DAUDET\n75014 PARIS",
    contact: "Contato",
    contactText: "01 56 08 06 19",
    qrCode: "Código QR",
    qrDesc: "Escaneie para acessar o menu",
    darkMode: "Modo escuro",
    language: "Idioma",
    entrees: "Entradas",
    plats: "Pratos Principais",
    desserts: "Sobremesas",
    admin: "Administração"
  },
  ru: {
    title: "Chez Alphonse",
    subtitle: "Парижский Ресторан",
    hero: "Добро пожаловать в Alphonse",
    heroDesc: "Откройте для себя нашу традиционную французскую кухню с японскими нотками в теплой и элегантной обстановке.",
    menu: "Наше Меню",
    about: "Наша История",
    aboutDesc: "Созданный после Covid, Chez Alphonse родился из страсти создать дружелюбное место, где смешиваются французские традиции и азиатские влияния. Наша молодая и динамичная команда встречает вас в теплой атмосфере с сильной приверженностью свежим, сезонным продуктам и нулевым отходам.",
    info: "Практическая Информация",
    hours: "Часы работы",
    hoursText: "Пн-Пт\n08:00 - 00:00\nСб-Вс\n09:00 - 00:00\nКухня: 12:00 - 23:00",
    address: "Адрес",
    addressText: "16 RUE ALPHONSE DAUDET\n75014 ПАРИЖ",
    contact: "Контакт",
    contactText: "01 56 08 06 19",
    qrCode: "QR-код",
    qrDesc: "Сканируйте для доступа к меню",
    darkMode: "Темный режим",
    language: "Язык",
    entrees: "Закуски",
    plats: "Основные Блюда",
    desserts: "Десерты",
    admin: "Администрация"
  },
  zh: {
    title: "Chez Alphonse",
    subtitle: "巴黎餐厅",
    hero: "欢迎来到Alphonse",
    heroDesc: "Chez Alphonse提供优质美食，融合现代风味与传统法式菜肴，是寻求正宗餐饮和温馨氛围的理想选择。",
    menu: "我们的菜单",
    about: "我们的故事",
    aboutDesc: "疫情后创立的Chez Alphonse，源于创造一个友好场所的热情，这里推崇法式烹饪传统。我们年轻而充满活力的团队在温馨的氛围中欢迎您，坚持使用新鲜的时令产品。",
    info: "实用信息",
    hours: "营业时间",
    hoursText: "周一-周五\n08:00 - 00:00\n周六-周日\n09:00 - 00:00\n厨房: 12:00 - 23:00",
    address: "地址",
    addressText: "16 RUE ALPHONSE DAUDET\n75014 巴黎",
    contact: "联系方式",
    contactText: "01 56 08 06 19",
    qrCode: "二维码",
    qrDesc: "扫描访问菜单",
    darkMode: "深色模式",
    language: "语言",
    entrees: "开胃菜",
    plats: "主菜",
    desserts: "甜点",
    admin: "管理"
  },
  ar: {
    title: "Chez Alphonse",
    subtitle: "مطعم باريسي",
    hero: "أهلاً بكم في ألفونس",
    heroDesc: "اكتشفوا مطبخنا الفرنسي التقليدي مع لمسات من الإلهام الياباني في جو دافئ وأنيق.",
    menu: "قائمة طعامنا",
    about: "قصتنا",
    aboutDesc: "تم إنشاء Chez Alphonse بعد كوفيد من شغف خلق مكان ودود حيث تمتزج التقاليد الفرنسية والتأثيرات الآسيوية. فريقنا الشاب والديناميكي يرحب بكم في جو دافئ، مع التزام قوي بالمنتجات الطازجة والموسمية وعدم الهدر.",
    info: "معلومات عملية",
    hours: "ساعات العمل",
    hoursText: "الإثنين-الجمعة\n08:00 - 00:00\nالسبت-الأحد\n09:00 - 00:00\nالمطبخ: 12:00 - 23:00",
    address: "العنوان",
    addressText: "16 RUE ALPHONSE DAUDET\n75014 باريس",
    contact: "اتصال",
    contactText: "01 56 08 06 19",
    qrCode: "رمز الاستجابة السريعة",
    qrDesc: "امسح للوصول إلى القائمة",
    darkMode: "الوضع المظلم",
    language: "اللغة",
    entrees: "المقبلات",
    plats: "الأطباق الرئيسية",
    desserts: "الحلويات",
    admin: "الإدارة"
  }
}

function PublicSite() {
  const [isDark, setIsDark] = useState(false)
  const [language, setLanguage] = useState('fr')
  const [menuData, setMenuData] = useState(initialMenuData.fr)
  
  // Toast system for real-time updates
  const { toasts, toast, removeToast } = useToast()

  // Fetch menu data from Supabase
  const fetchMenu = async () => {
    try {
      console.log("Récupération des données depuis Supabase...");
      const { data, error } = await supabase
        .from("menu")
        .select("id, categorie, prix, nom_fr, nom_en, nom_es, nom_ja, nom_zh, description_fr, description_en, description_es, description_ja, description_zh")
        .order("created_at", { ascending: true });

      console.log("Données reçues de Supabase :", data);
      console.log("Erreur Supabase :", error);

      if (!error && data) {
        // Transform Supabase data to match our menu structure
        const transformedData = transformSupabaseData(data);
        setMenuData(transformedData);
      } else if (error) {
        console.error('Error fetching menu:', error);
        // Fallback to localStorage if Supabase fails
        const savedMenu = localStorage.getItem('chezAlphonseMenu');
        if (savedMenu) {
          try {
            const parsedMenu = JSON.parse(savedMenu);
            setMenuData(parsedMenu);
          } catch (parseError) {
            console.error('Error parsing menu data:', parseError);
            setMenuData(initialMenuData.fr);
          }
        }
      }
    } catch (error) {
      console.error('Error connecting to Supabase:', error);
      // Fallback to localStorage
      const savedMenu = localStorage.getItem('chezAlphonseMenu');
      if (savedMenu) {
        try {
          const parsedMenu = JSON.parse(savedMenu);
          setMenuData(parsedMenu);
        } catch (parseError) {
          setMenuData(initialMenuData.fr);
        }
      }
    }
  };

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

  // Setup Supabase Realtime subscription et rechargement automatique
  useEffect(() => {
    // Initial load
    fetchMenu();

    // Setup realtime subscription
    const subscription = supabase
      .channel("menu_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu" },
        (payload) => {
          console.log(" Menu mis à jour :", payload);
          
          // Show toast notification
          toast.success("✨ Carte mise à jour automatiquement");
          
          // Refresh menu data
          fetchMenu();
        }
      )
      .subscribe();

    // Setup rechargement automatique toutes les 20 secondes
    const autoRefreshInterval = setInterval(() => {
      console.log("Rechargement automatique des données...");
      fetchMenu();
    }, 20000); // 20 secondes

    return () => {
      supabase.removeChannel(subscription);
      clearInterval(autoRefreshInterval); // Nettoyer l'intervalle
    };
  }, [])

  // Get current menu with automatic translation
  const getCurrentMenu = () => {
    // Use menuData from Supabase (with fallback to localStorage)
    if (menuData && menuData[language]) {
      // Use the menu for the current language if available
      return menuData[language]
    } else if (menuData && menuData.fr) {
      // Fallback to French menu and apply translation
      return translateMenu(menuData.fr, language)
    }
    
    // Final fallback to initial data
    if (language === 'fr') {
      return initialMenuData.fr
    }
    
    // Use automatic translation for non-French languages
    return translateMenu(initialMenuData.fr, language)
  }

  const t = translations[language]
  const menu = getCurrentMenu()

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const MenuSection = ({ title, items }) => (
    <div className="menu-section mb-12">
      <div className="flex items-center justify-center mb-8">
        <h3 className="text-4xl font-bold section-title">{title}</h3>
      </div>
      <div className="space-y-4">
        {items?.map((item) => {
          // Formater le prix avec Intl.NumberFormat
          const prixFormatte = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          }).format(item.price);
          
          return (
            <div key={item.id} className="menu-item">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="menu-item-name">{item.name}</h4>
                  <p className="menu-item-description">{item.description}</p>
                </div>
                <span className="menu-item-price ml-4">{prixFormatte}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center space-x-3">
              <img 
                src={logoImage} 
                alt="Chez Alphonse" 
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold logo-text">Chez Alphonse</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Restaurant Parisien</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {/* Language Selector */}
              <select 
                id="public-language-selector"
                name="language"
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="language-selector text-sm px-2 py-1 rounded border bg-background"
              >
                <option value="fr"> Français</option>
                <option value="en"> English</option>
                <option value="es"> Español</option>
                <option value="ja"> 日本語</option>
                <option value="zh"> 中文</option>
              </select>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                aria-label="Mode sombre"
                className="p-2"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Admin Link */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '#/admin'}
                className="text-xs px-3 py-1"
              >
                {t.admin}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {t.hero}
          </h1>
          <p className="hero-subtitle">
            {t.heroDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              className="restaurant-button text-lg px-8 py-4"
              onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t.menu}
            </Button>
            <Button 
              className="secondary-button text-lg px-8 py-4"
              onClick={() => document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <MapPin className="w-5 h-5 mr-2" />
              {t.info}
            </Button>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-5xl font-bold text-center mb-16 section-title">{t.menu}</h2>
          <div className="max-w-4xl mx-auto">
            <MenuSection title={t.entrees} items={menu?.entrees} />
            <MenuSection title={t.plats} items={menu?.plats} />
            <MenuSection title={t.desserts} items={menu?.desserts} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-16 section-title">{t.about}</h2>
            <div className="restaurant-card">
              <p className="text-lg leading-relaxed">
                {t.aboutDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Review Section */}
      <ReviewSection language={language} />

      {/* Info Section */}
      <section id="info" className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 section-title">{t.info}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="restaurant-card text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t.hours}</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {t.hoursText}
              </p>
            </div>
            
            <div className="restaurant-card text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t.address}</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {t.addressText}
              </p>
            </div>
            
            <div className="restaurant-card text-center">
              <Instagram className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t.contact}</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {t.contactText}
              </p>
              <p className="text-muted-foreground">
                <a href="https://www.instagram.com/chez_alphonse" target="_blank" rel="noopener noreferrer">
                  @chez_alphonse
                </a>
              </p>
            </div>
            
            <div className="restaurant-card text-center">
              <QrCode className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t.qrCode}</h3>
              <p className="text-muted-foreground mb-4">
                {t.qrDesc}
              </p>
              <div className="flex justify-center">
                <QRCodeGenerator url={window.location.origin} size={120} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 {t.title} - {t.subtitle}
          </p>
        </div>
      </footer>

      {/* Toast Container for real-time notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default PublicSite

