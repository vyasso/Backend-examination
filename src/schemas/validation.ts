// Regler för att registrera en användare
export const registerSchema = {
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password'], // Båda dessa MÅSTE finnas
      properties: {
        email: { type: 'string', format: 'email' }, // Måste se ut som en riktig e-post
        password: { type: 'string', minLength: 6 }  // Minst 6 tecken
      }
    }
  }
};

// Regler för att skapa ett event
export const createEventSchema = {
  schema: {
    body: {
      type: 'object',
      required: ['title', 'date'], 
      properties: {
        title: { type: 'string', minLength: 3 }, // Titeln måste vara minst 3 bokstäver
        description: { type: 'string' },
        date: { type: 'string' }
      }
    }
  }
};