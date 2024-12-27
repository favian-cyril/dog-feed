
interface BreedResponse {
  message: {
    [key: string]: string[]
  }
}

interface RandomImagesResponse {
  message: string,
  status: string
}

class DogService {
  async getBreeds(): Promise<string[]> {
    const res = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await res.json() as BreedResponse;
    // Get all breeds without sub-breeds
    return Object.keys(data.message)
  }

  async getRandomByBreed(breeds: string[]): Promise<{ breed: string, photo: string }[] | null> {
    if (breeds.length === 0) return null
    const requests = breeds.map((breed) => fetch(`https://dog.ceo/api/breed/${breed}/images/random`))
    const res = await Promise.all(requests)
    const data = await Promise.all(res.map(r => r.json())) as RandomImagesResponse[]
    // Concat all the images to array of breeds
    return breeds.map((breed, index) => ({ breed, photo: data[index].message }))
  }
}

export default new DogService()