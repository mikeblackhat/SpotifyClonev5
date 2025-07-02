import { Adapter, AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from 'next-auth/adapters';
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from './mongodb';

interface MongoDBAdapterOptions {
  collections?: {
    Users?: string;
    Accounts?: string;
    Sessions?: string;
    VerificationTokens?: string;
  };
}

// Tipos para documentos MongoDB
interface MongoDBUser extends Omit<AdapterUser, 'id'> {
  _id: ObjectId;
  email: string;
  emailVerified: Date | null;
  password?: string;
  plan?: string;
  provider?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MongoDBAccount extends Omit<AdapterAccount, 'userId'> {
  _id: ObjectId;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface MongoDBSession extends Omit<AdapterSession, 'userId'> {
  _id: ObjectId;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface MongoDBVerificationToken extends Omit<VerificationToken, 'expires'> {
  _id: ObjectId;
  expires: Date;
}

export default async function MongoDBAdapter(
  clientPromise: Promise<MongoClient>,
  options: MongoDBAdapterOptions = {}
): Promise<Adapter> {
  const collections = {
    Users: options.collections?.Users || 'users',
    Accounts: options.collections?.Accounts || 'accounts',
    Sessions: options.collections?.Sessions || 'sessions',
    VerificationTokens: options.collections?.VerificationTokens || 'verification_tokens',
  };

  const client = await clientPromise;
  const db = client.db();

  // Asegurarse de que los índices existan
  await db.collection(collections.Users).createIndex({ email: 1 }, { unique: true });
  await db.collection(collections.Accounts).createIndex(
    { provider: 1, providerAccountId: 1 },
    { unique: true }
  );
  await db.collection(collections.Sessions).createIndex(
    { sessionToken: 1 },
    { unique: true }
  );
  await db.collection(collections.VerificationTokens).createIndex(
    { identifier: 1, token: 1 },
    { unique: true }
  );

  // Función auxiliar para convertir documentos MongoDB a tipos Adapter
  const toAdapterUser = (user: MongoDBUser | null): AdapterUser | null => {
    if (!user) return null;
    const { _id, password, ...userData } = user;
    return { 
      ...userData, 
      id: _id.toString(),
      emailVerified: userData.emailVerified || null 
    } as AdapterUser;
  };

  return {
    async createUser(userData: Omit<AdapterUser, 'id'>) {
      const now = new Date();
      const user: Omit<MongoDBUser, '_id'> = {
        ...userData,
        email: userData.email?.toLowerCase() || '',
        emailVerified: userData.emailVerified || null,
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await db.collection<Omit<MongoDBUser, '_id'>>(collections.Users).insertOne(user);
      const newUser = await db.collection<MongoDBUser>(collections.Users).findOne({ _id: result.insertedId });
      
      if (!newUser) throw new Error('User not created');
      
      const { _id, ...userWithoutId } = newUser;
    },

    async getUser(id: string) {
      const user = await db.collection<MongoDBUser>(collections.Users).findOne({ _id: new ObjectId(id) });
      return toAdapterUser(user);
    },

    async getUserByEmail(email: string) {
      const user = await db.collection<MongoDBUser>(collections.Users).findOne({ 
        email: email.toLowerCase() 
      });
      return toAdapterUser(user);
    },

    async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
      const account = await db.collection<MongoDBAccount>(collections.Accounts).findOne({
        provider,
        providerAccountId,
      });
      
      if (!account) return null;
      
      const user = await db.collection<MongoDBUser>(collections.Users).findOne({ 
        _id: new ObjectId(account.userId.toString()) 
      });
      
      return toAdapterUser(user);
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>) {
      const { id, ...userData } = user;
      const updateData = {
        ...userData,
        ...(userData.email && { email: userData.email.toLowerCase() }),
        updatedAt: new Date(),
      };

      await db
        .collection<MongoDBUser>(collections.Users)
        .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
      
      const updatedUser = await db.collection<MongoDBUser>(collections.Users).findOne({ _id: new ObjectId(id) });
      return toAdapterUser(updatedUser) as AdapterUser;
    },

    async deleteUser(id: string) {
      const userId = new ObjectId(id);
      await db.collection(collections.Users).deleteOne({ _id: userId });
      await db.collection(collections.Sessions).deleteMany({ userId });
      await db.collection(collections.Accounts).deleteMany({ userId });
    },

    async linkAccount(account: AdapterAccount) {
      const { userId, ...rest } = account;
      const now = new Date();
      
      const accountData: Omit<MongoDBAccount, '_id'> = {
        ...rest,
        userId: new ObjectId(userId),
        createdAt: now,
        updatedAt: now,
      };

      await db.collection<Omit<MongoDBAccount, '_id'>>(collections.Accounts).insertOne(accountData);
      return account;
    },

    async unlinkAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
      await db.collection(collections.Accounts).deleteOne({ provider, providerAccountId });
    },

    async createSession(session: { sessionToken: string; userId: string; expires: Date }) {
      const now = new Date();
      const sessionData: Omit<MongoDBSession, '_id'> = {
        ...session,
        userId: new ObjectId(session.userId),
        createdAt: now,
        updatedAt: now,
      };

      await db.collection<Omit<MongoDBSession, '_id'>>(collections.Sessions).insertOne(sessionData);
      return session;
    },

    async getSessionAndUser(sessionToken: string) {
      const session = await db.collection<MongoDBSession>(collections.Sessions).findOne({ sessionToken });
      if (!session) return null;

      const user = await db.collection<MongoDBUser>(collections.Users).findOne({ 
        _id: new ObjectId(session.userId.toString()) 
      });
      if (!user) return null;

      return {
        session: {
          sessionToken: session.sessionToken,
          userId: user._id.toString(),
          expires: session.expires,
        },
        user: toAdapterUser(user) as AdapterUser,
      };
    },

    async updateSession({ sessionToken, userId, expires, ...data }: { sessionToken: string } & Partial<AdapterSession>) {
      const updateData: Partial<MongoDBSession> = {
        ...data,
        updatedAt: new Date(),
      };

      // Solo agregar los campos si están definidos
      if (userId) {
        updateData.userId = new ObjectId(userId);
      }
      if (expires) {
        updateData.expires = expires;
      }

      await db
        .collection<MongoDBSession>(collections.Sessions)
        .updateOne({ sessionToken }, { $set: updateData });
      
      return null;
    },

    async deleteSession(sessionToken: string) {
      await db.collection(collections.Sessions).deleteOne({ sessionToken });
    },

    async createVerificationToken(verificationToken: VerificationToken) {
      const tokenData: MongoDBVerificationToken = {
        ...verificationToken,
        _id: new ObjectId(),
        expires: verificationToken.expires,
      };

      await db.collection<MongoDBVerificationToken>(collections.VerificationTokens).insertOne(tokenData);
      return verificationToken;
    },

    async useVerificationToken({ identifier, token }: { identifier: string; token: string }) {
      const verificationToken = await db.collection<MongoDBVerificationToken>(collections.VerificationTokens)
        .findOneAndDelete({ identifier, token });

      if (!verificationToken) return null;
      
      const { _id, ...tokenData } = verificationToken;
      return tokenData as VerificationToken;
    },
  };
}
