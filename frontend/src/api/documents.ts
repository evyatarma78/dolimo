import axios from 'axios';
import { Document } from '../types/document';

export const fetchDocuments = async (): Promise<Document[]> => {
  const { data } = await axios.get('http://localhost:4000/api/documents');
  return data;
};