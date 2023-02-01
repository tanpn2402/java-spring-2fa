import TailwindElm from '../../components/commons/TailwindElm';
import MenuNav from './MenuNav';

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <div className="min-h-full">
        <MenuNav />
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      <TailwindElm />
    </>
  )
}
