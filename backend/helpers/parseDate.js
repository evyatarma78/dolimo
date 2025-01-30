module.exports = (dateString) => {
    if (!dateString) return null;
    
    // Handle DD/MM/YYYY format
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return new Date(year, month - 1, day);
    }
    
    // Try standard date parsing as fallback
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? null : parsed;
  };