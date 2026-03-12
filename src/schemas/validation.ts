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


/*

 * 1. REGISTRERA KONTO
 * POST http://localhost:3000/api/auth/register
 * Body: { "email": "test@test.se", "password": "password123" }
 *
 * 2. LOGGA IN
 * POST http://localhost:3000/api/auth/login
 * Body: { "email": "test@test.se", "password": "password123" }
 * (Kopiera din accessToken och lägg under fliken Authorization -> Bearer Token)
 *
 * 3. SKAPA EVENT (Kräver Admin-token)
 * POST http://localhost:3000/api/events
 * Body: { "title": "Presentation", "description": "API Demo", "date": "2026-03-20T10:00:00Z" }
 *
 * 4. KOLLA PÅ EVENTS (Öppen för alla)
 * GET http://localhost:3000/api/events
 * Body: (tom)
 *
 * 5. TA BORT EVENT (Kräver Admin-token)
 * DELETE http://localhost:3000/api/events/KLISTRA_IN_EVENT_ID_HÄR
 * Body: (tom)
 */

/*
Admin-konto:
"email": "ronaldo@example.com",
  "password": "mypassword123"
*/