
export function validate(schema, data) {
  const result = schema.safeParse(data);

  if (result.success) {
    return { valid: true, errors: {}, data: result.data };
  }

  // Flatten Zod issues into { fieldName: "first error message" }
  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return { valid: false, errors };
}
