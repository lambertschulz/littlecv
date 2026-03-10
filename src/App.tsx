import { SplitPane } from './components/SplitPane'

function App() {
  return (
    <div className="flex flex-col h-screen">
      <header className="h-14 border-b border-gray-200 bg-white flex items-center px-4 shrink-0">
        <h1 className="text-lg font-bold">Bewerbungsmappe</h1>
      </header>
      <SplitPane
        editor={<div className="p-4">Editor coming soon...</div>}
        preview={<div className="p-4">Preview coming soon...</div>}
      />
    </div>
  )
}

export default App
