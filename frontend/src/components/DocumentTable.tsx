
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Loader2, AlertCircle } from 'lucide-react';
import { fetchDocuments } from '../api/documents';

export function DocumentTable() {
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 gap-2">
        <AlertCircle className="w-6 h-6" />
        <p>Error loading documents</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-800 text-gray-100">
          <tr>
            <th className="px-6 py-4">מספר הזמנה </th>
            <th className="px-6 py-4">תאריך</th>
            <th className="px-6 py-4">מס׳ לקוח </th>
            <th className="px-6 py-4">סה״כ הזמנה </th>
            <th className="px-6 py-4">סוג מסמך</th>
            <th className="px-6 py-4">סטאטוס</th>
          </tr>
        </thead>
        <tbody>
          {documents?.map((doc) => (
            <tr 
              key={doc.document_number}
              className="bg-white border-b hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 font-medium">{doc.document_number}</td>
              <td className="px-6 py-4">
                {format(new Date(doc.document_date), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4">{doc.customer_id || '-'}</td>
              <td className="px-6 py-4">
                {doc.document_total
                  ? new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(doc.document_total)
                  : '-'}
              </td>
              <td className="px-6 py-4">{doc.document_type_name || '-'}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doc.is_canceled
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {doc.is_canceled ? 'Canceled' : 'Active'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}