export const validateCampaign = (formData) => {
  const errors = {};
  
  if (!formData.title.trim()) {
    errors.title = 'Title is required';
  } else if (formData.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (formData.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  if (!formData.description.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (formData.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  if (!formData.duration || formData.duration < 1) {
    errors.duration = 'Duration must be at least 1 day';
  } else if (formData.duration > 30) {
    errors.duration = 'Duration cannot exceed 30 days';
  }

  return errors;
}; 