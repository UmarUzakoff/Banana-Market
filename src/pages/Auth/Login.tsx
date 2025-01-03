import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setAuthenticated, setToken, setRole } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post("https://productscategoriesexpress-production.up.railway.app/login", data);
      const { token } = response.data;

      setToken(token);
      setAuthenticated(true);

      const decodedToken = jwtDecode<any>(token);
      const userRole = decodedToken.role;
      setRole(userRole);

      if (userRole === "admin") {
        navigate("/dashboard/products");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Invalid email or password!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md shadow-2xl rounded-lg border border-gray-300 bg-white p-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="w-full border-gray-300 shadow-md focus:ring-2 focus:ring-banana focus:outline-none"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message as string}
                </span>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="w-full border-gray-300 shadow-md focus:ring-2 focus:ring-banana focus:outline-none"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message as string}
                </span>
              )}
            </div>
            <div className="flex justify-center space-x-4">
              <Button
                type="submit"
                className="w-full bg-banana text-white py-2 rounded-md">
                Login
              </Button>
            </div>
          </form>

          <div className="flex justify-center mt-4">
            <Separator className="w-full" />
          </div>

          <div className="flex justify-center mt-4 space-x-4">
            <Button
              variant="link"
              onClick={() => navigate("/register")}
              className="text-banana">
              Don't have an account? Register
            </Button>
            <Button
              variant="link"
              onClick={() => navigate("/")}
              className="text-banana">
              Go Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
