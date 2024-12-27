import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { toUpperCaseFirstLetter } from "@/lib/utils";
import DogService from "@/service/DogService";
import { UserData } from "@/types/User";
import { arrayRemove, arrayUnion, doc, getFirestore, onSnapshot, updateDoc } from "firebase/firestore";
import { Heart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const db = getFirestore();

const Dashboard = () => {
  const { userData, id, selectedBreeds } = useUser()
  const [loading, setLoading] = useState(false);
  const [randomDogs, setRandomDogs] = useState<{ breed: string, photo: string }[]>([]);
  const [likedPhotos, setLikedPhotos] = useState(new Set());

  const getFavouriteBreeds = useCallback(async () => {
    setLoading(true)
    const photos = await DogService.getRandomByBreed(selectedBreeds);
    if (photos) {
      setRandomDogs(photos)
      setLoading(false)
    }
  }, [selectedBreeds])

  const likePhoto = async (photo: string) => {
    try {
      if (id && userData) {
        let newData 
        // Add/remove to likedPhotos
        if (likedPhotos.has(photo)) {
          newData = {
            likedPhotos: arrayRemove(photo)
          }
        } else {
          newData = {
            likedPhotos: arrayUnion(photo)
          }
        }
        await updateDoc(doc(db, 'users', id), newData)
      }
    } catch (error) {
      console.error('Error updating document:', error);
    }
  }

  useEffect(() => {
    // Subscribe to changes in likedPhotos
    const unsubscribe = onSnapshot(
      doc(db, 'users', id || ''),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data() as UserData;
          setLikedPhotos(new Set(userData.likedPhotos));
        }
      },
      (error) => {
        console.error('Error listening to likes:', error);
      }
    );

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    getFavouriteBreeds()
  }, [getFavouriteBreeds, userData]);
  return (
    <div className="flex flex-col w-screen p-10 gap-2">
      <Button className="w-20" onClick={getFavouriteBreeds}>Refresh</Button>
      {loading ?
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /> : 
          <div className="flex w-full h-full gap-3">
            {randomDogs.map(dog => (
              <Card className="min-w-32" key={dog.breed}>
                <CardHeader className="text-lg">{toUpperCaseFirstLetter(dog.breed)}</CardHeader>
                <CardContent>
                  <img className="w-100 h-60" src={dog.photo} />
                </CardContent>
                <CardFooter className="justify-end">
                  <Heart className="w-6 h-6 cursor-pointer" onClick={() => likePhoto(dog.photo)} fill={likedPhotos.has(dog.photo) ? "#dc2626" : "#ffffff"} />
                </CardFooter>
              </Card>
            ))}
          </div>
        
      }
    </div>
  );
}

export default Dashboard;
