import { useState, useEffect, useRef } from 'react'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import { ReactNode } from 'react'

interface Props {
  position: string
  children: ReactNode
}

const LayoutWrapper = ({ position, children }: Props) => {
  const [isSticky, setIsSticky] = useState(false)
  const ref = useRef()

  const stuckClasses = "flex items-center justify-between py-2 sticky top-n-1 z-50 transition-all backdrop isSticky px-4 mx-auto sm:px-6 md:px-[10%]";
  const unstuckClasses = "flex items-center justify-between py-10 sticky top-n-1 z-50 transition-all backdrop px-4 mx-auto sm:px-6 md:px-[10%] mt-2";

  const inlineStyles = {
    position: "sticky",
    [position]: -1,
  }

  const classes = isSticky ? stuckClasses : unstuckClasses
  
  // mount 
  useEffect(()=>{
    const cachedRef = ref.current,
          observer = new IntersectionObserver(
            ([e]) => setIsSticky(e.intersectionRatio < 1),
            {
              threshold: [1.0],
              // rootMargin: '-1px 0px 0px 0px',  // alternativly, use this and set `top:0` in the CSS
            }
          )

    observer.observe(cachedRef)
    
    // unmount
    return function(){
      observer.unobserve(cachedRef)
    }
  }, [ref])

  return (
    <SectionContainer>
      <div className="flex flex-col justify-between">
        <div className='full-width'>
        <header style={inlineStyles} className={classes} ref={ref}>
          <div>
            <Link href="/" aria-label="Tailwind CSS Blog">
              <div className="flex items-center justify-between">
                <div className="mr-3">
                  <Logo />
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="hidden h-6 text-2xl font-semibold sm:block title">
                    {siteMetadata.headerTitle}
                  </div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="p-1 font-medium text-gray-900 sm:p-4 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {link.title}
                </Link>
              ))}
            </div>
            <ThemeSwitch />
            <MobileNav />
          </div>
          
        </header>
        <SectionContainer>
        <main className="mb-auto">{children}</main>
        <Footer />
        </SectionContainer>
      </div>
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
