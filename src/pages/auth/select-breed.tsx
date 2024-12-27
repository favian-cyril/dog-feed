import { useEffect, useState } from 'react';
import DogService from "@/service/DogService"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from 'zod';
import { useFieldArray, useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router';
import { toUpperCaseFirstLetter } from '@/lib/utils';

const formSchema = z.object({
  favouriteBreeds: z.array(z.object({
    value: z.string().min(1, "Dog Breed can't be empty")
  })).min(1).max(3)
})

const SelectBreed = () => {
  const { setSelectedBreeds } = useUser()
  const navigate = useNavigate();
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      favouriteBreeds: [{ value: "" }]
    }
  })
  const { errors } = useFormState({
    control: form.control
  })
  const { fields, append, remove } = useFieldArray<z.infer<typeof formSchema>>({
    control: form.control,
    name: "favouriteBreeds",
  });

  useEffect(() => {
    async function getBreeds() {
      const data = await DogService.getBreeds();
      setDogBreeds(data);
    }
    getBreeds()
  }, []);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setSelectedBreeds(values.favouriteBreeds.map(val => val.value))
    navigate('/dashboard')
  }
  
  return (
    <div className="flex flex-col w-screen py-12">
      <Card className="max-w-xl w-full m-auto">
        <CardHeader className="flex items-center">
          <CardTitle>Select Your Favourite Dog Breeds (3 Max)</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="flex flex-col gap-2">
                  {fields.map((item, index) => (
                    <div key={item.id} className="flex gap-1">
                      <FormField
                        control={form.control}
                        name={`favouriteBreeds.${index}`}
                        render={({ field }) => (
                          <div className="w-full">
                            <Select onValueChange={(val) => field.onChange({ value: val })} value={field.value.value}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Favourite Dog Breed" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {dogBreeds.map(breed => (
                                    <SelectItem key={breed} value={breed}>{toUpperCaseFirstLetter(breed)}</SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {errors.favouriteBreeds && errors.favouriteBreeds[index] && <div className='text-red-500 text-sm'>{errors.favouriteBreeds[index].value?.message}</div>}
                          </div>
                        )}
                      />
                      <Button onClick={() => remove(index)} type="button">Remove</Button>
                    </div>
                  ))}
                  {fields.length < 3 && <Button variant="secondary" type="button" onClick={() => append({ value: "" })}>Add More</Button>}
                  <Button type="submit" className="w-full mt-2" variant="default">
                    View Feed
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
      </Card>
    </div>
  );
}

export default SelectBreed;
