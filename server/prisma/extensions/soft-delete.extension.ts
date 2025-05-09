import { Prisma } from '@prisma/client';

// On utilise un type générique pour éviter les erreurs de typage
export const softDeleteExtension = Prisma.defineExtension((client: any) => {
  return client.$extends({
    query: {
      user: {
        async delete({ args, query }) {
          // Au lieu de supprimer, on fait une mise à jour pour définir deletedAt
          // On modifie args pour qu'il utilise update au lieu de delete
          return query({
            ...args,
            data: { deletedAt: new Date() },
            __operation: 'update' // Indique que nous voulons faire un update, pas un delete
          });
        }
      }
    }
  });
});
