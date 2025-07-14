import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from './ui/button'

const ReviewSection = ({ language }) => {
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedStar, setSelectedStar] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const translations = {
    fr: {
      title: "Votre avis compte !",
      subtitle: "Partagez votre expérience chez Alphonse",
      cta: "Laisser un avis Google",
      thankYou: "Merci pour votre confiance !"
    },
    en: {
      title: "Your opinion matters!",
      subtitle: "Share your experience at Alphonse",
      cta: "Leave a Google Review",
      thankYou: "Thank you for your trust!"
    },
    es: {
      title: "¡Tu opinión importa!",
      subtitle: "Comparte tu experiencia en Alphonse",
      cta: "Dejar una reseña en Google",
      thankYou: "¡Gracias por tu confianza!"
    },
    ja: {
      title: "あなたのご意見をお聞かせください！",
      subtitle: "アルフォンスでの体験をシェアしてください",
      cta: "Googleレビューを書く",
      thankYou: "ご信頼いただきありがとうございます！"
    },
    de: {
      title: "Ihre Meinung zählt!",
      subtitle: "Teilen Sie Ihre Erfahrung bei Alphonse",
      cta: "Google-Bewertung hinterlassen",
      thankYou: "Vielen Dank für Ihr Vertrauen!"
    },
    it: {
      title: "La tua opinione conta!",
      subtitle: "Condividi la tua esperienza da Alphonse",
      cta: "Lascia una recensione Google",
      thankYou: "Grazie per la tua fiducia!"
    },
    pt: {
      title: "Sua opinião importa!",
      subtitle: "Compartilhe sua experiência no Alphonse",
      cta: "Deixar uma avaliação no Google",
      thankYou: "Obrigado pela sua confiança!"
    },
    zh: {
      title: "您的意见很重要！",
      subtitle: "分享您在Alphonse的体验",
      cta: "在Google上留下评价",
      thankYou: "感谢您的信任！"
    }
  }

  const t = translations[language] || translations.fr

  const handleStarClick = (starIndex) => {
    setSelectedStar(starIndex)
    setIsAnimating(true)
    
    // Animation effect
    setTimeout(() => {
      setIsAnimating(false)
    }, 1000)

    // Redirect to specific Google Reviews page immediately
    setTimeout(() => {
      window.open('https://www.google.com/search?sa=X&sca_esv=5a4b1ba8a892269d&hl=fr&tbm=lcl&sxsrf=AE3TifODPIQOE5g8GQCYlEChYXn8LcPpVw:1752243108019&q=Chez+Alphonse+Avis&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxIxNDOyNDI1MDY0sDQ0MTewNDI3Mt3AyPiKUcg5I7VKwTGnICM_rzhVwbEss3gRKxZBAM5Hzx5FAAAA&rldimm=16292503109147092725&ved=2ahUKEwi31o2g_rSOAxW2VKQEHSHWDCgQ9fQKegQIUBAF&biw=1536&bih=825&dpr=2&pli=1&authuser=2#lkt=LocalPoiReviews&pli=1&lrd=0x47e6712b1a5dec21:0xe21a9941a2a8e6f5,3,,,,', '_blank')
    }, 500)
  }

  const handleStarHover = (starIndex) => {
    setHoveredStar(starIndex)
  }

  const handleStarLeave = () => {
    setHoveredStar(0)
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gold/10 to-terracotta/10">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="restaurant-card">
          <h2 className="text-4xl font-bold mb-4 section-title">{t.title}</h2>
          <p className="text-lg mb-8 opacity-80">{t.subtitle}</p>
          
          {/* Interactive Stars */}
          <div className="flex justify-center items-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`transition-all duration-300 transform hover:scale-110 ${
                  isAnimating && selectedStar >= star ? 'animate-bounce' : ''
                }`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
                style={{ animationDelay: `${star * 100}ms` }}
              >
                <Star
                  className={`w-12 h-12 transition-all duration-300 ${
                    (hoveredStar >= star || selectedStar >= star)
                      ? 'fill-[#CFAE7C] text-[#CFAE7C] drop-shadow-lg'
                      : 'text-gray-300 hover:text-[#CFAE7C]'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Thank you message */}
          {selectedStar > 0 && (
            <div className="animate-fade-in-up mb-6">
              <p className="text-xl font-semibold text-[#CFAE7C] mb-4">
                {t.thankYou}
              </p>
              <p className="text-sm opacity-70">
                Redirection vers Google Reviews...
              </p>
            </div>
          )}

          {/* CTA Button */}
          <Button
            className="restaurant-button text-lg px-8 py-4"
            onClick={() => window.open('https://www.google.com/search?sa=X&sca_esv=5a4b1ba8a892269d&hl=fr&tbm=lcl&sxsrf=AE3TifODPIQOE5g8GQCYlEChYXn8LcPpVw:1752243108019&q=Chez+Alphonse+Avis&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxIxNDOyNDI1MDY0sDQ0MTewNDI3Mt3AyPiKUcg5I7VKwTGnICM_rzhVwbEss3gRKxZBAM5Hzx5FAAAA&rldimm=16292503109147092725&ved=2ahUKEwi31o2g_rSOAxW2VKQEHSHWDCgQ9fQKegQIUBAF&biw=1536&bih=825&dpr=2&pli=1&authuser=2#lkt=LocalPoiReviews&pli=1&lrd=0x47e6712b1a5dec21:0xe21a9941a2a8e6f5,3,,,,', '_blank')}
          >
            <Star className="w-5 h-5 mr-2" />
            {t.cta}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ReviewSection

