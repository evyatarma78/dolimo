export interface Document {
  document_number: string;
  document_date: string;
  customer_id: string | null;
  document_total: number | null;
  is_canceled: boolean;
  document_type_name: string | null;
}