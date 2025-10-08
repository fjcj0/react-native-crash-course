import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";
type AuthContextType = {
    user: Models.User<Models.Preferences> | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<string | null>;
    signIn: (email: string, password: string) => Promise<string | null>;
    signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getUser();
    }, []);
    const getUser = async () => {
        try {
            const session = await account.get();
            setUser(session);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    const signIn = async (email: string, password: string) => {
        try {
            await account.createEmailPasswordSession(email, password);
            await getUser();
            return null;
        } catch (error) {
            if (error instanceof Error) return error.message;
            return "An error occurred during Sign In!!";
        }
    };
    const signUp = async (email: string, password: string) => {
        try {
            await account.create(ID.unique(), email, password);
            await signIn(email, password);
            return null;
        } catch (error) {
            if (error instanceof Error) return error.message;
            return "An error occurred during Sign Up!!";
        }
    };
    const signOut = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
                return;
            }
            alert(error);
        }
    };
    return (
        <AuthContext.Provider value={{ signOut, user, loading, signIn, signUp }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be inside of an AuthProvider!");
    return context;
};