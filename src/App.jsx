import TimeRegistration from './components/TimeRegistration/Index.jsx'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Valori Timeregistrering
        </h1>
        <TimeRegistration />
      </div>
    </div>
  );
}


export default App; 