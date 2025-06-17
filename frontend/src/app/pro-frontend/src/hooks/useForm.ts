import { useState, useCallback } from 'react';

/**
 * Custom hook for handling form state with validation
 * @param initialValues Initial form values
 * @param validate Validation function that returns errors object
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle field change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );
  
  // Set a specific field value programmatically
  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);
  
  // Mark field as touched on blur
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
      
      // Run validation if provided
      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);
      }
    },
    [values, validate]
  );
  
  // Reset the form to initial state
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Submit handler
  const handleSubmit = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement>,
      onSubmit: (values: T) => Promise<void> | void
    ) => {
      e.preventDefault();
      
      // Validate all fields
      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);
        
        // Mark all fields as touched
        const touchedFields = Object.keys(values).reduce(
          (acc, key) => ({
            ...acc,
            [key]: true,
          }),
          {}
        );
        
        setTouched(touchedFields as Partial<Record<keyof T, boolean>>);
        
        // If there are errors, don't submit
        if (Object.keys(validationErrors).length > 0) {
          return;
        }
      }
      
      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate]
  );
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    handleSubmit,
  };
}
