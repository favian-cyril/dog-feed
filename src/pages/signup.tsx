import { useState } from "react"
import { AuthError, createUserWithEmailAndPassword, getAuth, UserCredential } from "firebase/auth"
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import app from "@/firebase"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNavigate } from "react-router";

const auth = getAuth(app);
const db = getFirestore();

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Minimum of 8 characters"),
  passwordRepeat: z.string().min(8, "Minimum of 8 characters"),
}).superRefine(({ passwordRepeat, password }, ctx) => {
  if (passwordRepeat !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['passwordRepeat']
    });
  }
})

export function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordRepeat: "",
    }
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth, 
        values.email, 
        values.password
      );

      const firestoreUser = {
        email: values.email,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), firestoreUser);
      navigate('/login')
    } catch (error) {
      const authError = error as AuthError;
      form.setError('email',
       {
        message: authError.code === 'auth/email-already-in-use' 
          ? 'Email is already registered' 
          : 'An error occurred during registration'
       }
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-6 w-full py-12">
      <Card className="max-w-2xl w-full m-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your email to sign up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-2">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input
                          type="email"
                          {...field}
                        />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input
                          type="password"
                          {...field}
                        />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="passwordRepeat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repeat Password</FormLabel>
                        <FormControl>
                        <Input
                          type="password"
                          {...field}
                        />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full mt-2" variant="default" disabled={isLoading}>
                  Sign Up
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
