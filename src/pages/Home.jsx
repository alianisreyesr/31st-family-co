import { Hero } from '../components/Hero.jsx'
import { DropSection } from '../components/DropSection.jsx'
import { Statement } from '../components/Statement.jsx'
import { Values } from '../components/Values.jsx'
import { SocialProof } from '../components/SocialProof.jsx'
import { Faq } from '../components/Faq.jsx'
import { Signup } from '../components/Signup.jsx'
import { StickyBuyBar } from '../components/StickyBuyBar.jsx'

export function Home() {
  return (
    <>
      <Hero />
      <DropSection />
      <Statement />
      <Values />
      <SocialProof />
      <Faq />
      <Signup />
      <StickyBuyBar />
    </>
  )
}
