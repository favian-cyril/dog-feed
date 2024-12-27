import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Outlet } from 'react-router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { UserData } from '@/types/User';
import { UserProvider } from '@/context/UserProvider';

const db = getFirestore();

const AuthLayout = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);

  const fetchUserData = useCallback(async () => {
    try {
      if (!auth.currentUser?.uid) return
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data() as UserData);
      } else {
        console.log('No user data found in Firestore');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [auth.currentUser?.uid])

  useEffect(() => {
    // subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        setIsAuthenticated(true);
        fetchUserData()
      } else {
        setIsAuthenticated(false);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, fetchUserData, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar onSignout={handleSignOut} />
      <main>
        <UserProvider value={{ userData, isLoading, id: auth.currentUser?.uid || null, selectedBreeds, setSelectedBreeds }}>
          <Outlet />
        </UserProvider>
      </main>
    </SidebarProvider>
  );
};

export default AuthLayout;