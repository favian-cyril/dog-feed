import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import app from "@/firebase"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthError, getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { z } from "zod"

const auth = getAuth(app);

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export function Login() {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      navigate('/select-breed')
    } catch (e) {
      const authError = e as AuthError;
      if (authError.code === 'auth/invalid-credentials') {
        form.setError("password", { message: "Wrong password"})
      }
      if (authError.code === 'auth/invalid-email') {
        form.setError("email", { message: "Email not found"})
      }
    }
  }
  return (
    <div className="flex flex-col gap-6 w-full py-12">
      <Card className="max-w-2xl w-full m-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" variant="default" className="w-full mt-2">
                  Login
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
