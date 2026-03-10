import { SplitPane } from './components/SplitPane'
import { Preview } from './components/Preview'

function App() {
  return (
    <div className="flex flex-col h-screen">
      <header className="h-14 border-b border-gray-200 bg-white flex items-center px-4 shrink-0">
        <h1 className="text-lg font-bold">Bewerbungsmappe</h1>
      </header>
      <SplitPane
        editor={<div className="p-4">Editor coming soon...</div>}
        preview={<Preview />}
      />
    </div>
  )
}

export default App
