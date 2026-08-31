import { useCallback, useRef, useState } from 'react'
import { Hero } from '../components/Hero.jsx'
import { UpcomingSection } from '../components/UpcomingSection.jsx'
import { Statement } from '../components/Statement.jsx'
import { ArchiveSection } from '../components/ArchiveSection.jsx'
import { Promise as PromiseSection } from '../components/Promise.jsx'
import { Faq } from '../components/Faq.jsx'
import { Signup } from '../components/Signup.jsx'
import { ProductModal } from '../components/ProductModal.jsx'
import { StickyWaitlist } from '../components/StickyWaitlist.jsx'
import { focusWaitlist } from '../lib/waitlist.js'

export function Home() {
  const [selected, setSelected] = useState(null)
  const [interest, setInterest] = useState(null)
  const emailRef = useRef(null)

  const closeModal = useCallback(() => setSelected(null), [])

  /**
   * «Quiero acceso» / «Avísame del restock» desde cualquier tarjeta: se recuerda
   * la pieza y se lleva a la persona al formulario, con el foco puesto.
   */
  const joinWaitlist = useCallback((product) => {
    setInterest(product)
    focusWaitlist(emailRef)
  }, [])

  return (
    <>
      <Hero />
      <UpcomingSection onWaitlist={joinWaitlist} onOpenDetails={setSelected} />
      <Statement />
      <ArchiveSection onWaitlist={joinWaitlist} onOpenDetails={setSelected} />
      <PromiseSection />
      <Faq />
      <Signup interest={interest} inputRef={emailRef} />
      <StickyWaitlist />
      <ProductModal product={selected} onClose={closeModal} onWaitlist={joinWaitlist} />
    </>
  )
}
