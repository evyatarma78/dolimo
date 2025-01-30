import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DocumentTable } from './components/DocumentTable';
import { FileText } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">כל ההזמנות</h1>
          </div>
          <DocumentTable />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;